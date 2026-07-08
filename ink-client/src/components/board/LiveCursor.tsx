import { motion } from 'framer-motion'

interface Props {
  x: number
  y: number
  name: string
  color: string
}

export default function LiveCursor({ x, y, name, color }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      style={{ left: x, top: y }}
      className="absolute pointer-events-none z-50"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" className="drop-shadow-md">
        <path
          d="M0 0 L0 12 L3.5 8.5 L6.5 15 L8.5 14 L5.5 7.5 L10 7.5 Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <div
        className="mt-0.5 ml-3 px-2 py-0.5 rounded-lg text-white text-[10px] font-bold whitespace-nowrap shadow-lg"
        style={{ background: color }}
      >
        {name}
      </div>
    </motion.div>
  )
}