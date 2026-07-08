import { Router, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import { authenticate, AuthRequest } from '../middleware/auth'
import prisma from '../lib/prisma'

const router = Router()

const generateRoomId = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase()

const getRoomId = (req: AuthRequest): string => {
  const roomId = req.params.roomId

  if (Array.isArray(roomId)) {
    return roomId[0]?.toUpperCase() || ''
  }

  return roomId?.toUpperCase() || ''
}

const validateRequest = (req: AuthRequest, res: Response): boolean => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return false
  }

  return true
}

router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const boards = await prisma.board.findMany({
      where: { createdBy: req.user!.userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        user: { select: { name: true, avatar: true } },
        _count: { select: { messages: true } },
      },
    })

    res.json({ boards })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post(
  '/',
  authenticate,
  [body('name').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Board name must be 1-120 characters')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!validateRequest(req, res)) return

    try {
      const requestedName = typeof req.body.name === 'string' ? req.body.name.trim() : ''
      let roomId = generateRoomId()

      while (await prisma.board.findUnique({ where: { roomId } })) {
        roomId = generateRoomId()
      }

      const board = await prisma.board.create({
        data: {
          roomId,
          name: requestedName || 'Untitled Board',
          createdBy: req.user!.userId,
        },
      })

      res.status(201).json({ board })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.get(
  '/:roomId',
  authenticate,
  [param('roomId').isAlphanumeric().isLength({ min: 6, max: 12 }).withMessage('Invalid room ID')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!validateRequest(req, res)) return

    try {
      const roomId = getRoomId(req)

      const board = await prisma.board.findUnique({
        where: { roomId },
        include: { user: { select: { name: true, avatar: true } } },
      })

      if (!board) {
        res.status(404).json({ error: 'Board not found' })
        return
      }

      res.json({ board })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.patch(
  '/:roomId',
  authenticate,
  [
    param('roomId').isAlphanumeric().isLength({ min: 6, max: 12 }).withMessage('Invalid room ID'),
    body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Board name must be 1-120 characters'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!validateRequest(req, res)) return

    try {
      const roomId = getRoomId(req)

      const board = await prisma.board.findFirst({
        where: {
          roomId,
          createdBy: req.user!.userId,
        },
      })

      if (!board) {
        res.status(404).json({ error: 'Board not found or you do not have permission to edit it' })
        return
      }

      const updated = await prisma.board.update({
        where: { id: board.id },
        data: { name: req.body.name.trim() },
      })

      res.json({ board: updated })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.delete(
  '/:roomId',
  authenticate,
  [param('roomId').isAlphanumeric().isLength({ min: 6, max: 12 }).withMessage('Invalid room ID')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!validateRequest(req, res)) return

    try {
      const roomId = getRoomId(req)

      const result = await prisma.board.deleteMany({
        where: {
          roomId,
          createdBy: req.user!.userId,
        },
      })

      if (result.count === 0) {
        res.status(404).json({ error: 'Board not found or you do not have permission to delete it' })
        return
      }

      res.json({ message: 'Board deleted' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

export default router