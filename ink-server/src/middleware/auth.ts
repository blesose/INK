import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  userId: string
  email: string
  name: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export const verifyJwt = (token: string): AuthUser => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  return jwt.verify(token, process.env.JWT_SECRET) as AuthUser
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    req.user = verifyJwt(authHeader.slice('Bearer '.length))
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

