import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import type { User } from '../types/index'
import api from '../lib/api'
import { disconnectSocket } from '../lib/socket'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  googleAuth: (code: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('ink_token')
      const savedUser = localStorage.getItem('ink_user')

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      localStorage.removeItem('ink_token')
      localStorage.removeItem('ink_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const persistSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem('ink_token', nextToken)
    localStorage.setItem('ink_user', JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password })
    persistSession(res.data.token, res.data.user)
    toast.success(`Welcome back, ${res.data.user.name}!`)
  }

  const register = async (email: string, name: string, password: string) => {
    const res = await api.post('/api/auth/register', { email, name, password })
    persistSession(res.data.token, res.data.user)
    toast.success(`Account created. Welcome to INK, ${res.data.user.name}.`)
  }

  const googleAuth = async (code: string) => {
    const res = await api.post('/api/auth/google', { code })
    persistSession(res.data.token, res.data.user)
    toast.success(`Welcome to INK, ${res.data.user.name}.`)
  }

  const logout = () => {
    disconnectSocket()
    localStorage.removeItem('ink_token')
    localStorage.removeItem('ink_user')
    setToken(null)
    setUser(null)
    toast.success('Signed out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, googleAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

