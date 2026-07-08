import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${dark ? 'bg-white/5 border-white/10 text-white/60 hover:text-white' : 'bg-black/5 border-black/10 text-black/60 hover:text-black'}`}
    >
      <motion.span
        initial={false}
        animate={{ rotate: dark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {dark ? <Moon size={13} /> : <Sun size={13} />}
      </motion.span>
      {dark ? 'Dk' : 'Lt'}
    </motion.button>
  )
}