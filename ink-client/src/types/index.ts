// export interface User {
//   id: string
//   email: string
//   name: string
//   avatar: string | null
// }

// export interface Board {
//   id: string
//   roomId: string
//   name: string
//   createdAt: string
//   updatedAt: string
//   createdBy: string
//   user: {
//     name: string
//     avatar: string | null
//   }
//   _count?: {
//     messages: number
//   }
// }

// export interface Message {
//   id: string
//   text: string
//   name: string
//   color: string
//   avatar: string
//   timestamp: string
// }

// export interface CursorData {
//   x: number
//   y: number
//   name: string
//   color: string
// }

// export interface NoteData {
//   id: string
//   x: number
//   y: number
//   text: string
//   color: string
// }

// export interface AuthResponse {
//   token: string
//   user: User
// }

export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
}

export interface Board {
  id: string
  roomId: string
  name: string
  createdAt: string
  updatedAt: string
  createdBy: string
  user: {
    name: string
    avatar: string | null
  }
  _count?: {
    messages: number
  }
}

export interface Message {
  id: string
  text: string
  name: string
  color: string
  avatar: string | null
  timestamp: string
}

export interface CursorData {
  x: number
  y: number
  name: string
  color: string
}

export interface NoteData {
  id: string
  x: number
  y: number
  text: string
  color: string
}

export interface AuthResponse {
  token: string
  user: User
}

