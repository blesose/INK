import { motion } from 'framer-motion'
import {
  Pencil, Eraser, Minus, Square, Circle,
  Undo2, Redo2, Trash2, StickyNote, MousePointer
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../ThemeToggle'

export type Tool = 'select' | 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle'

interface Props {
  tool: Tool
  color: string
  brushSize: number
  onToolChange: (t: Tool) => void
  onColorChange: (c: string) => void
  onBrushSizeChange: (s: number) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onAddNote: () => void
}

const COLORS = [
  '#7c3aed', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#ffffff', '#1a1a2e'
]

const tools = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'pen', icon: Pencil, label: 'Pen' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
]

export default function Toolbar({
  tool, color, brushSize,
  onToolChange, onColorChange, onBrushSizeChange,
  onUndo, onRedo, onClear, onAddNote
}: Props) {
  const { dark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed left-0 top-0 h-full w-16 z-20 flex flex-col items-center py-4 gap-1 border-r ${
        dark
          ? 'bg-[#0f0f17]/95 border-white/8'
          : 'bg-white/95 border-black/8'
      } backdrop-blur-xl`}
    >
      {/* Logo */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center mb-3 shadow-lg shadow-violet-500/30 flex-shrink-0">
        <Pencil size={14} color="white" />
      </div>

      {/* Section label */}
      <span className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-white/25' : 'text-black/30'}`}>
        Tools
      </span>

      {/* Tool buttons */}
      {tools.map(t => (
        <motion.button
          key={t.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToolChange(t.id as Tool)}
          title={t.label}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
            tool === t.id
              ? 'bg-violet-500/20 text-violet-400 outline outline-1 outline-violet-500/40'
              : dark
                ? 'text-white/35 hover:bg-white/8 hover:text-white/70'
                : 'text-black/35 hover:bg-black/5 hover:text-black/70'
          }`}
        >
          <t.icon size={16} />
          {tool === t.id && (
            <motion.div
              layoutId="activeTool"
              className="absolute right-1 w-1 h-1 rounded-full bg-violet-400"
            />
          )}
        </motion.button>
      ))}

      {/* Divider */}
      <div className={`w-8 h-px my-1 flex-shrink-0 ${dark ? 'bg-white/8' : 'bg-black/8'}`} />

      {/* Style label */}
      <span className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-white/25' : 'text-black/30'}`}>
        Style
      </span>

      {/* Color swatch */}
      <div
        title="Color"
        className="w-8 h-8 rounded-xl relative overflow-hidden flex-shrink-0 cursor-pointer shadow-lg"
        style={{
          background: color,
          boxShadow: `0 0 12px ${color}60`,
          border: `2px solid ${color}80`
        }}
      >
        <input
          type="color"
          value={color}
          onChange={e => onColorChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>

      {/* Color presets */}
      <div className="grid grid-cols-2 gap-1 px-1 flex-shrink-0">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={`w-4 h-4 rounded-full transition-all hover:scale-110 ${
  color === c
    ? dark
      ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-[#0f0f17]'
      : 'ring-2 ring-violet-400 ring-offset-2 ring-offset-white'
    : ''
}`}
            style={{
              background: c,
              border: c === '#ffffff' ? '1px solid rgba(0,0,0,0.2)' : undefined,
            }}
          />
        ))}
      </div>

      {/* Brush size */}
      <span className={`text-[9px] mt-1 flex-shrink-0 ${dark ? 'text-white/25' : 'text-black/30'}`}>
        {brushSize}px
      </span>
      <div className="w-10 flex-shrink-0">
        <input
          type="range" min="1" max="20" value={brushSize}
          onChange={e => onBrushSizeChange(Number(e.target.value))}
          className="w-full h-1 rounded cursor-pointer accent-violet-500"
          style={{
            background: `linear-gradient(to right, #7c3aed ${(brushSize / 20) * 100}%, ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${(brushSize / 20) * 100}%)`
          }}
        />
      </div>

      {/* Divider */}
      <div className={`w-8 h-px my-1 flex-shrink-0 ${dark ? 'bg-white/8' : 'bg-black/8'}`} />

      {/* Actions label */}
      <span className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-white/25' : 'text-black/30'}`}>
        Actions
      </span>

      {/* Sticky note */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddNote}
        title="Add sticky note"
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'text-white/35 hover:bg-white/8 hover:text-white/70' : 'text-black/35 hover:bg-black/5 hover:text-black/70'}`}
      >
        <StickyNote size={16} />
      </motion.button>

      {/* Undo */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUndo}
        title="Undo (Ctrl+Z)"
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'text-white/35 hover:bg-white/8 hover:text-white/70' : 'text-black/35 hover:bg-black/5 hover:text-black/70'}`}
      >
        <Undo2 size={16} />
      </motion.button>

      {/* Redo */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRedo}
        title="Redo (Ctrl+Y)"
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'text-white/35 hover:bg-white/8 hover:text-white/70' : 'text-black/35 hover:bg-black/5 hover:text-black/70'}`}
      >
        <Redo2 size={16} />
      </motion.button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Clear */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClear}
        title="Clear canvas"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all mb-2"
      >
        <Trash2 size={16} />
      </motion.button>
    </motion.div>
  )
}