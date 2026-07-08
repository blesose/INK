import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pencil, Users, Zap, Globe, ArrowRight, Play } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Landing() {
  const navigate = useNavigate()
  const { dark } = useTheme()

  const features = [
    { icon: Zap, title: 'Real-time Sync', desc: 'Draw and see changes instantly with your team.' },
    { icon: Users, title: 'Invite & Collaborate', desc: 'Invite anyone with a link. No sign-up required for viewers.' },
    { icon: Pencil, title: 'Beautiful & Intuitive', desc: 'A clean, modern interface that keeps you focused.' },
    { icon: Globe, title: 'Access Anywhere', desc: 'Your boards, anytime, on any device.' },
  ]

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#05050a] text-white' : 'bg-[#f8f8fc] text-[#0a0a0f]'} transition-colors duration-300 overflow-x-hidden`}>

      {/* Grid background */}
      <div className="grid-bg fixed inset-0 pointer-events-none" />

      {/* 3D Glow orbs - Hidden on mobile */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed w-[700px] h-[700px] rounded-full pointer-events-none hidden md:block"
        style={{ top: '-200px', left: '-200px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none hidden md:block"
        style={{ bottom: '-150px', right: '-100px', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)' }}
      />

      {/* Nav - Responsive */}
      <nav className={`sticky top-0 z-50 border-b ${dark ? 'border-white/8 bg-[#05050a]/80' : 'border-black/8 bg-[#f8f8fc]/80'} backdrop-blur-xl px-4 sm:px-6 md:px-12 h-14 sm:h-16 flex items-center justify-between`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-2.5"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Pencil size={12} color="white" />
          </div>
          <span className="font-syne font-extrabold text-lg sm:text-xl">INK</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 sm:gap-3"
        >
          <ThemeToggle />
          <button
            onClick={() => navigate('/login')}
            className={`hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-sm border transition-all ${
              dark ? 'border-white/10 text-white/60 hover:text-white hover:border-white/20' : 'border-black/10 text-black/60 hover:text-black hover:border-black/20'
            }`}>
            Log in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-br from-violet-600 to-purple-700 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30 transition-all whitespace-nowrap">
            {window.innerWidth < 640 ? 'Start' : 'Get Started'}
          </button>
        </motion.div>
      </nav>

      {/* Hero - Responsive */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs text-violet-400 font-semibold whitespace-nowrap">
              Real-time Collaborative Whiteboard
            </span>
          </motion.div>

          <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-3 sm:mb-5 tracking-tight">
            Draw together,{' '}
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              in real time
            </span>{' '}
            <span className="inline-block">🚀</span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md ${dark ? 'text-white/50' : 'text-black/50'}`}>
            INK is a real-time collaborative whiteboard for teams, classrooms, and creative minds.
          </p>

          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(124,58,237,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/25">
              {window.innerWidth < 480 ? 'Start Board' : 'Start a Board'} <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-medium text-sm border transition-all ${
                dark ? 'border-white/10 text-white/70 hover:border-white/20' : 'border-black/10 text-black/70 hover:border-black/20'
              }`}>
              <Play size={14} /> <span className="hidden xs:inline">Log in</span>
            </motion.button>
          </div>

          <div className="flex gap-3 sm:gap-6 mt-6 sm:mt-10 flex-wrap">
            {['⚡ Real-time Sync', '🔗 Share Anywhere', '🔒 Secure & Fast'].map(f => (
              <span key={f} className={`text-[10px] sm:text-xs ${dark ? 'text-white/35' : 'text-black/35'}`}>{f}</span>
            ))}
          </div>
        </motion.div>

        {/* 3D Preview Card - Hidden on very small screens */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ rotateY: -3, rotateX: 3, scale: 1.02 }}
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          className={`rounded-2xl border p-3 sm:p-5 shadow-2xl hidden sm:block ${dark ? 'bg-white/3 border-white/8 shadow-black/50' : 'bg-white border-black/8 shadow-black/10'}`}
        >
          {/* Canvas preview */}
          <div className={`rounded-xl h-36 sm:h-44 md:h-52 mb-3 sm:mb-4 relative overflow-hidden ${dark ? 'bg-[#0f0f17]' : 'bg-gray-50'}`}>
            {/* Dot grid */}
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

            {/* Drawing elements */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-3 sm:top-5 left-6 sm:left-10 font-cursive text-xl sm:text-2xl text-violet-500 opacity-60"
              style={{ fontFamily: 'cursive', transform: 'rotate(-5deg)' }}>
              INK
            </motion.div>

            <div className="absolute top-10 sm:top-14 right-4 sm:right-8 bg-yellow-200 rounded-lg p-1.5 sm:p-2.5 text-[8px] sm:text-[10px] text-gray-700 font-semibold shadow-md">
              Design Review<br className="hidden sm:inline" />Tomorrow 10AM
            </div>

            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-20 sm:w-28 h-10 sm:h-16 border-2 border-violet-500/50 rounded" />

            {/* Live cursors - Hidden on small screens */}
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 sm:top-10 left-28 sm:left-36 hidden sm:block"
            >
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[10px] border-l-transparent border-r-transparent border-b-blue-500" />
              <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap">John</span>
            </motion.div>

            <motion.div
              animate={{ x: [0, -15, 0], y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-8 sm:bottom-12 right-8 sm:right-16 hidden sm:block"
            >
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[10px] border-l-transparent border-r-transparent border-b-green-500" />
              <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap">Sarah</span>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
              <span className={`text-[10px] sm:text-xs ${dark ? 'text-white/45' : 'text-black/45'}`}>4 users online</span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-violet-400 bg-violet-500/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-violet-500/20 font-semibold">
              Room: 7X8K3A
            </span>
          </div>
        </motion.div>
      </div>

      {/* Features - Responsive */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pb-12 sm:pb-16 md:pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
            Why teams love{' '}
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">INK</span>
          </h2>
          <p className={`text-sm sm:text-base ${dark ? 'text-white/45' : 'text-black/45'}`}>
            Built for seamless collaboration and powerful creativity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-4 sm:p-5 md:p-7 rounded-2xl border cursor-default ${dark ? 'bg-white/3 border-white/7' : 'bg-white border-black/8'}`}
            >
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/10 flex items-center justify-center mb-2 sm:mb-4 border border-violet-500/20">
                <f.icon size={16} className="text-violet-400" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">{f.title}</h3>
              <p className={`text-[10px] sm:text-xs leading-relaxed ${dark ? 'text-white/45' : 'text-black/45'}`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA - Responsive */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pb-12 sm:pb-16 md:pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-3xl border p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 ${
            dark ? 'bg-gradient-to-br from-violet-500/10 to-pink-500/5 border-white/7' : 'bg-gradient-to-br from-violet-50 to-pink-50 border-black/8'
          }`}
        >
          <div className="text-center sm:text-left">
            <h2 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 sm:mb-2">
              Ready to create, collaborate, and inspire?
            </h2>
            <p className={`text-xs sm:text-sm ${dark ? 'text-white/45' : 'text-black/45'}`}>
              Join teams already using INK.
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-violet-500/25 whitespace-nowrap"
          >
            {window.innerWidth < 480 ? 'Get Started' : 'Start Your First Board'} <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </div>

    </div>
  )
}