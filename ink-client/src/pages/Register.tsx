import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pencil, ArrowRight } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Register() {
  const navigate = useNavigate()
  const { register, googleAuth } = useAuth()
  const { dark } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, name, password)
      navigate('/dashboard')
      toast.success('Account created successfully!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = useGoogleLogin({
  flow: 'auth-code',
  onSuccess: async (codeResponse) => {
    setGoogleLoading(true)
    setError('')

    try {
      await googleAuth(codeResponse.code)
      navigate('/dashboard')
      toast.success('Welcome to INK!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  },
  onError: () => setError('Google sign-in was cancelled or failed.')
})
  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'bg-[#05050a] text-white' : 'bg-[#f8f8fc] text-[#0a0a0f]'} transition-colors duration-300 relative overflow-hidden`}>
      <div className="grid-bg absolute inset-0" />

      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ bottom: '-150px', right: '-100px', background: 'radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 65%)' }} />

      <nav className="flex items-center justify-between px-8 py-4 relative z-10">
        <Link to="/landing" className="flex items-center gap-2 no-underline">
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
          className={`w-full max-w-md rounded-3xl border p-12 backdrop-blur-2xl ${dark ? 'bg-white/3 border-white/7 shadow-[0_32px_80px_rgba(0,0,0,0.5)]' : 'bg-white/90 border-black/8 shadow-[0_32px_80px_rgba(0,0,0,0.08)]'}`}
        >
          <div className="text-center mb-9">
            <motion.div whileHover={{ scale: 1.05, rotate: -3 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 mb-4 shadow-[0_8px_32px_rgba(124,58,237,0.4)]">
              <Pencil size={22} color="white" />
            </motion.div>
            <h1 className="font-syne text-2xl font-extrabold mb-1.5">Create account</h1>
            <p className={`text-sm ${dark ? 'text-white/35' : 'text-black/40'}`}>Start collaborating with INK</p>
          </div>

          {/* Google Button */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGoogle()}
            disabled={googleLoading || loading}
            type="button"
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border text-sm font-semibold transition-all mb-5 disabled:opacity-50 disabled:cursor-not-allowed ${
              dark ? 'bg-white/5 border-white/10 text-white hover:bg-white/8'
                   : 'bg-white border-black/10 text-[#0a0a0f] hover:bg-black/2 shadow-sm'
            }`}
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Connecting...
              </span>
            ) : (
              <><FcGoogle size={20} />Continue with Google</>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`flex-1 h-px ${dark ? 'bg-white/8' : 'bg-black/8'}`} />
            <span className={`text-[11px] ${dark ? 'text-white/25' : 'text-black/30'}`}>or sign up with email</span>
            <div className={`flex-1 h-px ${dark ? 'bg-white/8' : 'bg-black/8'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs text-center">
                {error}
              </motion.div>
            )}

            {[
              { label: 'Full Name', type: 'text', value: name, set: setName, placeholder: 'Camila James'},
              { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com'},
              { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: 'Min. 6 characters'},
            ].map(f => (
              <div key={f.label}>
                <label className={`block text-[10px] font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-white/35' : 'text-black/45'}`}>{f.label}</label>
                <div className="relative">
                  
                  <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} required
                    placeholder={f.placeholder}
                    className={`ink-input pl-10 ${dark ? 'bg-white/4 border border-white/8 text-white placeholder:text-white/20 focus:border-violet-500/60 focus:bg-violet-500/5' : 'bg-black/3 border border-black/10 text-[#0a0a0f] placeholder:text-black/25 focus:border-violet-500/60'}`} />
                </div>
              </div>
            ))}

            <motion.button whileHover={{ y: -1, boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading || googleLoading}
              className="ink-btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : <><span>Create account</span><ArrowRight size={15} /></>}
            </motion.button>
          </form>

          <p className={`text-center text-xs mt-6 ${dark ? 'text-white/30' : 'text-black/40'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 font-semibold no-underline hover:text-violet-300">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}