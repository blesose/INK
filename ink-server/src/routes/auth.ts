import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { OAuth2Client } from 'google-auth-library'
import prisma from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

const signToken = (userId: string, email: string, name: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  return jwt.sign({ userId, email, name }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const initialsFor = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
    body('password').isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const { email, name, password } = req.body
      const existing = await prisma.user.findUnique({ where: { email } })

      if (existing) {
        res.status(400).json({ error: 'Email already in use' })
        return
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          avatar: initialsFor(name),
          provider: 'local',
        },
      })

      res.status(201).json({
        token: signToken(user.id, user.email, user.name),
        user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const { email, password } = req.body
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user || user.provider === 'google' || !user.password) {
        res.status(401).json({
          error: user?.provider === 'google'
            ? 'This account uses Google sign-in. Please continue with Google.'
            : 'Invalid email or password',
        })
        return
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        res.status(401).json({ error: 'Invalid email or password' })
        return
      }

      res.json({
        token: signToken(user.id, user.email, user.name),
        user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.post(
  '/google',
  [body('code').isString().notEmpty().withMessage('Google authorization code required')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const { code } = req.body
      const { tokens } = await googleClient.getToken({
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      })

      if (!tokens.id_token) {
        res.status(401).json({ error: 'Google did not return an identity token' })
        return
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      if (!payload?.email || !payload.sub) {
        res.status(400).json({ error: 'Could not get required Google profile details' })
        return
      }

      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { googleId: payload.sub },
            { email: payload.email },
          ],
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            avatar: payload.picture,
            provider: 'google',
            googleId: payload.sub,
          },
        })
      } else if (user.provider === 'local') {
        res.status(400).json({
          error: 'An account with this email already exists. Please sign in with your password.',
        })
        return
      } else if (!user.googleId || user.avatar !== payload.picture || user.name !== payload.name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: user.googleId || payload.sub,
            avatar: payload.picture || user.avatar,
            name: payload.name || user.name,
          },
        })
      }

      res.json({
        token: signToken(user.id, user.email, user.name),
        user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      })
    } catch (err) {
      console.error(err)
      res.status(401).json({ error: 'Google authentication failed' })
    }
  }
)

router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, avatar: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

