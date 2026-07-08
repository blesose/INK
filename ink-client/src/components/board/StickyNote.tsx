import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  id: string
  x: number
  y: number
  text: string
  color: string
  onMove: (id: string, x: number, y: number) => void
  onTextChange: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export default function StickyNote({ id, x, y, text, color, onMove, onTextChange, onDelete }: Props) {
  const dragOffset = useRef<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
    e.preventDefault()
    dragOffset.current = { x: e.clientX - x, y: e.clientY - y }
    setIsDragging(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragOffset.current) return
      onMove(id, e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y)
    }

    const handleMouseUp = () => {
      dragOffset.current = null
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: isDragging ? 1.05 : 1, y: 0 }}
      onMouseDown={handleMouseDown}
      style={{ left: x, top: y, background: color }}
      className={`absolute w-44 rounded-xl shadow-lg cursor-grab z-10 select-none ${isDragging ? 'cursor-grabbing shadow-2xl' : ''}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 pt-2 pb-1">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-black/10" />
          <div className="w-2 h-2 rounded-full bg-black/10" />
          <div className="w-2 h-2 rounded-full bg-black/10" />
        </div>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={() => onDelete(id)}
          className="w-5 h-5 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
        >
          <X size={10} className="text-black/60" />
        </button>
      </div>

      <textarea
        value={text}
        onChange={e => onTextChange(id, e.target.value)}
        placeholder="Type a note..."
        className="w-full min-h-[90px] border-none bg-transparent resize-none px-3 pb-3 text-xs font-sans text-gray-800 outline-none placeholder:text-black/30"
      />
    </motion.div>
  )
}