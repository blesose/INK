import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import authRoutes from './routes/auth'
import boardRoutes from './routes/boards'
import prisma from './lib/prisma'
import { validateEnv } from './lib/env'
import { verifyJwt } from './middleware/auth'

dotenv.config()
validateEnv()

const app = express()
const server = http.createServer(app)
const clientUrl = process.env.CLIENT_URL!

app.use(cors({ origin: clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.get('/api/health', (_, res) => res.json({ status: 'ok', project: 'INK' }))
app.get('/', (_, res) => res.json({ status: 'ok', project: 'INK' }))

const io = new Server(server, {
  cors: { origin: clientUrl, methods: ['GET', 'POST'] },
})

const roomNotes: Record<string, Record<string, any>> = {}
const roomMessages: Record<string, any[]> = {}
const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#ec4899', '#f59e0b', '#14b8a6', '#f97316', '#84cc16']

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token

    if (typeof token !== 'string' || !token) {
      next(new Error('Authentication required'))
      return
    }

    const decoded = verifyJwt(token)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, avatar: true },
    })

    if (!user) {
      next(new Error('User not found'))
      return
    }

    socket.data.user = user
    next()
  } catch {
    next(new Error('Invalid or expired token'))
  }
})

io.on('connection', socket => {
  socket.data.userColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  console.log('Connected:', socket.id)

  const broadcastPeople = (roomId: string) => {
    const room = io.sockets.adapter.rooms.get(roomId)
    if (!room) return

    const people: any[] = []
    room.forEach(socketId => {
      const s = io.sockets.sockets.get(socketId)
      if (!s?.data.user) return

      people.push({
        id: socketId,
        userId: s.data.user.id,
        name: s.data.user.name,
        color: s.data.userColor,
        avatar: s.data.user.avatar,
      })
    })

    io.to(roomId).emit('people-update', people)
  }

  socket.on('join-room', async (roomId: string) => {
    if (typeof roomId !== 'string' || !/^[A-Z0-9]{6,12}$/i.test(roomId)) {
      socket.emit('room-error', 'Invalid room ID')
      return
    }

    const normalizedRoomId = roomId.toUpperCase()
    const board = await prisma.board.findUnique({ where: { roomId: normalizedRoomId } })
    if (!board) {
      socket.emit('room-error', 'Board not found')
      return
    }

    socket.join(normalizedRoomId)
    socket.data.roomId = normalizedRoomId

    const count = io.sockets.adapter.rooms.get(normalizedRoomId)?.size || 0
    io.to(normalizedRoomId).emit('user-count', count)
    socket.emit('init-notes', Object.values(roomNotes[normalizedRoomId] || {}))
    socket.emit('init-messages', roomMessages[normalizedRoomId] || [])
    socket.emit('your-identity', {
      name: socket.data.user.name,
      color: socket.data.userColor,
      avatar: socket.data.user.avatar,
    })
    broadcastPeople(normalizedRoomId)
  })

  socket.on('leave-room', (roomId: string) => {
    const normalizedRoomId = roomId.toUpperCase()
    socket.leave(normalizedRoomId)
    const count = io.sockets.adapter.rooms.get(normalizedRoomId)?.size || 0
    io.to(normalizedRoomId).emit('user-count', count)
    socket.to(normalizedRoomId).emit('cursor-leave', socket.id)
    broadcastPeople(normalizedRoomId)
  })

  socket.on('draw', (data: any) => {
    if (socket.data.roomId) socket.to(socket.data.roomId).emit('draw', data)
  })

  socket.on('clear', () => {
    if (socket.data.roomId) {
      roomNotes[socket.data.roomId] = {}
      socket.to(socket.data.roomId).emit('clear')
    }
  })

  socket.on('cursor-move', ({ x, y }: { x: number; y: number }) => {
    if (!socket.data.roomId || typeof x !== 'number' || typeof y !== 'number') return

    socket.to(socket.data.roomId).emit('cursor-move', {
      id: socket.id,
      x,
      y,
      name: socket.data.user.name,
      color: socket.data.userColor,
    })
  })

  socket.on('note-add', (note: any) => {
    if (!socket.data.roomId || !note?.id) return
    if (!roomNotes[socket.data.roomId]) roomNotes[socket.data.roomId] = {}
    roomNotes[socket.data.roomId][note.id] = note
    socket.to(socket.data.roomId).emit('note-add', note)
  })

  socket.on('note-update', (note: any) => {
    if (!socket.data.roomId || !note?.id) return
    if (!roomNotes[socket.data.roomId]) roomNotes[socket.data.roomId] = {}
    roomNotes[socket.data.roomId][note.id] = note
    socket.to(socket.data.roomId).emit('note-update', note)
  })

  socket.on('note-delete', (id: string) => {
    if (!socket.data.roomId || typeof id !== 'string') return
    if (roomNotes[socket.data.roomId]) delete roomNotes[socket.data.roomId][id]
    socket.to(socket.data.roomId).emit('note-delete', id)
  })

  socket.on('chat-message', (text: string) => {
    if (!socket.data.roomId || typeof text !== 'string' || !text.trim()) return

    const message = {
      id: Date.now().toString(),
      text: text.trim().slice(0, 1000),
      name: socket.data.user.name,
      color: socket.data.userColor,
      avatar: socket.data.user.avatar,
      timestamp: new Date().toISOString(),
    }

    if (!roomMessages[socket.data.roomId]) roomMessages[socket.data.roomId] = []
    roomMessages[socket.data.roomId].push(message)
    if (roomMessages[socket.data.roomId].length > 100) roomMessages[socket.data.roomId].shift()
    io.to(socket.data.roomId).emit('chat-message', message)
  })

  socket.on('disconnect', () => {
    if (socket.data.roomId) {
      const count = io.sockets.adapter.rooms.get(socket.data.roomId)?.size || 0
      io.to(socket.data.roomId).emit('user-count', count)
      socket.to(socket.data.roomId).emit('cursor-leave', socket.id)
      broadcastPeople(socket.data.roomId)
    }
    console.log('Disconnected:', socket.id)
  })
})

const PORT = Number(process.env.PORT || 3001)
server.listen(PORT, () => {
  console.log(`INK server running on http://localhost:${PORT}`)
})

