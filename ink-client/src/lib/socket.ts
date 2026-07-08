import { io, Socket } from 'socket.io-client'
let socket: Socket | null = null

export const getSocket = (): Socket => {
  const token = localStorage.getItem('ink_token')

  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      autoConnect: false,
      auth: { token },
    })
  } else {
    socket.auth = { token }
  }

  return socket
}

export const connectSocket = () => {
  const s = getSocket()
  if (!s.connected) s.connect()
  return s
}

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect()
}

