import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Share2, Users, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../Avatar'

interface Person {
  id: string
  name: string
  color: string
  avatar: string | null
}

interface Props {
  roomId: string
  userCount: number
  myName: string
  myColor: string
  people: Person[]
}

export default function TopBar({ roomId, userCount, myName, myColor, people }: Props) {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        fixed top-0 right-0 z-20 flex items-center px-2 sm:px-3 md:px-4 gap-1.5 sm:gap-2 md:gap-3 border-b
        ${dark ? 'bg-[#0f0f17]/95 border-white/8' : 'bg-white/95 border-black/8'}
        backdrop-blur-xl
        ${isMobile ? 'left-14 h-11' : 'left-16 h-12'}
      `}
    >
      {/* Logo + name - hide on mobile */}
      {!isMobile && (
        <>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mr-1 md:mr-2 flex-shrink-0"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
              <Pencil size={isMobile ? 10 : 11} color="white" />
            </div>
            <span className={`font-syne font-extrabold text-xs sm:text-sm ${dark ? 'text-white' : 'text-[#0a0a0f]'}`}>
              INK
            </span>
          </button>

          <div className={`w-px h-4 sm:h-5 ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
        </>
      )}

      {/* Back button - only on mobile */}
      {isMobile && (
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-white/60 hover:text-white transition-colors flex-shrink-0"
        >
          <ChevronLeft size={18} />
          <Pencil size={12} color="white" />
        </button>
      )}

      {/* Room ID - responsive */}
      <div className={`
        flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border text-[10px] sm:text-xs flex-shrink-0
        ${dark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200'}
      `}>
        {!isMobile && (
          <span className={dark ? 'text-white/40' : 'text-black/40'}>Room</span>
        )}
        <span className="text-violet-400 font-bold tracking-wider">
          {isMobile ? roomId.slice(0, 6) : roomId}
        </span>
        <button 
          onClick={copyLink} 
          className="text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0"
        >
          {copied ? <Check size={isMobile ? 10 : 11} /> : <Copy size={isMobile ? 10 : 11} />}
        </button>
      </div>

      {/* Online count - hide text on mobile */}
      <div className={`
        flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full border text-[10px] sm:text-xs flex-shrink-0
        ${dark ? 'bg-green-500/8 border-green-500/20' : 'bg-green-50 border-green-200'}
      `}>
        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
        <span className={dark ? 'text-green-400' : 'text-green-600'}>
          {isMobile ? userCount : `${userCount} online`}
        </span>
      </div>

      {/* Live avatars - hide on mobile, show on tablet+ */}
      {!isMobile && (
        <div className="flex -space-x-2 flex-shrink-0">
          {people.slice(0, isTablet ? 3 : 5).map(person => (
            <Avatar
              key={person.id}
              name={person.name}
              avatar={person.avatar}
              color={person.color}
              size={isTablet ? 24 : 28}
              className={`ring-2 ${dark ? 'ring-[#0f0f17]' : 'ring-white'}`}
            />
          ))}
          {people.length > (isTablet ? 3 : 5) && (
            <div className={`
              w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-[8px] sm:text-[10px] font-bold flex-shrink-0
              ${dark ? 'bg-white/10 border-[#0f0f17] text-white/60' : 'bg-black/10 border-white text-black/60'}
            `}>
              +{people.length - (isTablet ? 3 : 5)}
            </div>
          )}
        </div>
      )}

      {/* My identity - hide on mobile */}
      {!isMobile && myName && (
        <div
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border text-[10px] sm:text-xs font-semibold flex-shrink-0"
          style={{
            background: `${myColor}18`,
            borderColor: `${myColor}40`,
            color: myColor
          }}
        >
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: myColor, boxShadow: `0 0 6px ${myColor}` }} />
          {isTablet ? myName.slice(0, 8) + (myName.length > 8 ? '…' : '') : myName}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1 min-w-[4px]" />

      {/* Share button - responsive */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={copyLink}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-lg text-[10px] sm:text-xs font-semibold shadow-lg shadow-violet-500/20 flex-shrink-0"
      >
        <Share2 size={isMobile ? 10 : 12} />
        {!isMobile && 'Share'}
      </motion.button>

      {/* People toggle - hide on mobile */}
      {!isMobile && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs transition-all flex-shrink-0
            ${dark ? 'border-white/10 text-white/50 hover:text-white hover:border-white/20' : 'border-black/10 text-black/50 hover:text-black hover:border-black/20'}
          `}
        >
          <Users size={isMobile ? 10 : 12} />
          {!isTablet && 'People'}
        </motion.button>
      )}
    </motion.div>
  )
}