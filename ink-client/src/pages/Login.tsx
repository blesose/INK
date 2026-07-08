import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pencil, Mail, Lock, ArrowRight } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import api from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const { login, googleAuth } = useAuth()
  const { dark } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const openNewBoard = async () => {
  try {
    const res = await api.post('/api/boards', { name: 'Untitled Board' })
    navigate(`/board/${res.data.board.roomId}`)
  } catch (err) {
    console.error('Board creation after login failed:', err)
    toast.error('Signed in, but could not create a board.')
    navigate('/dashboard')
  }
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      const serverError = err.response?.data?.error
      if (!err.response) setError('Cannot connect to server. Please try again.')
      else if (serverError === 'Invalid email or password') setError('No account found with this email or password is incorrect.')
      else setError(serverError || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = useGoogleLogin({
  flow: 'auth-code',
  onSuccess: async codeResponse => {
    setGoogleLoading(true)
    setError('')

    try {
      await googleAuth(codeResponse.code)
      navigate('/dashboard')
      toast.success('Welcome back!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  },
  onError: () => setError('Google sign-in was cancelled or failed.'),
})

  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'bg-[#05050a] text-white' : 'bg-[#f8f8fc] text-[#0a0a0f]'} transition-colors duration-300 relative overflow-hidden`}>
      <div className="grid-bg absolute inset-0" />

      <nav className="flex items-center justify-between px-8 py-4 relative z-10">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
            <Pencil size={12} color="white" />
          </div>
          <span className={`font-syne font-extrabold text-base ${dark ? 'text-white' : 'text-[#0a0a0f]'}`}>INK</span>
        </Link>
        <ThemeToggle />
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md rounded-3xl border p-12 backdrop-blur-2xl ${
            dark ? 'bg-white/3 border-white/7 shadow-[0_32px_80px_rgba(0,0,0,0.5)]'
              : 'bg-white/90 border-black/8 shadow-[0_32px_80px_rgba(0,0,0,0.08)]'
          }`}
        >
          <div className="text-center mb-9">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 mb-4 shadow-[0_8px_32px_rgba(124,58,237,0.4)]">
              <Pencil size={22} color="white" />
            </div>
            <h1 className="font-syne text-2xl font-extrabold mb-1.5">Welcome back</h1>
            <p className={`text-sm ${dark ? 'text-white/35' : 'text-black/40'}`}>Sign in to start a board</p>
          </div>

          <button
            onClick={() => handleGoogle()}
            disabled={googleLoading || loading}
            type="button"
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border text-sm font-semibold transition-all mb-5 disabled:opacity-50 disabled:cursor-not-allowed ${
              dark ? 'bg-white/5 border-white/10 text-white hover:bg-white/8'
                : 'bg-white border-black/10 text-[#0a0a0f] hover:bg-black/2 shadow-sm'
            }`}
          >
            {googleLoading ? 'Connecting...' : <><FcGoogle size={20} />Continue with Google</>}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className={`flex-1 h-px ${dark ? 'bg-white/8' : 'bg-black/8'}`} />
            <span className={`text-[11px] ${dark ? 'text-white/25' : 'text-black/30'}`}>or continue with email</span>
            <div className={`flex-1 h-px ${dark ? 'bg-white/8' : 'bg-black/8'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <div>
              <label className={`block text-[10px] font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-white/35' : 'text-black/45'}`}>Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={`ink-input pl-10 ${dark ? 'bg-white/4 border border-white/8 text-white placeholder:text-white/20 focus:border-violet-500/60' : 'bg-black/3 border border-black/10 text-[#0a0a0f] placeholder:text-black/25 focus:border-violet-500/60'}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-white/35' : 'text-black/45'}`}>Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 characters"
                  className={`ink-input pl-10 ${dark ? 'bg-white/4 border border-white/8 text-white placeholder:text-white/20 focus:border-violet-500/60' : 'bg-black/3 border border-black/10 text-[#0a0a0f] placeholder:text-black/25 focus:border-violet-500/60'}`}
                />
              </div>
            </div>

            <button type="submit" disabled={loading || googleLoading} className="ink-btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : <><span>Sign in</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className={`text-center text-xs mt-6 ${dark ? 'text-white/30' : 'text-black/40'}`}>
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 font-semibold no-underline hover:text-violet-300">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}