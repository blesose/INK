import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'
import { connectSocket } from '../lib/socket'
import Toolbar, { type Tool } from '../components/board/Toolbar'
import TopBar from '../components/board/TopBar'
import RightPanel from '../components/board/RightPanel'
import LiveCursor from '../components/board/LiveCursor'
import StickyNote from '../components/board/StickyNote'
import type { NoteData, CursorData, Message } from '../types/index'
import { MessageCircle } from 'lucide-react'

interface Point { x: number; y: number }
interface DrawData {
  from: Point
  to: Point
  color: string
  brushSize: number
  tool: 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle'
}
interface Person { id: string; name: string; color: string; avatar: string | null }

const NOTE_COLORS = ['#fef08a', '#86efac', '#93c5fd', '#f9a8d4', '#fdba74', '#c4b5fd']

// Responsive constants
const getSidebarWidth = () => {
  if (typeof window === 'undefined') return 64
  if (window.innerWidth < 640) return 56
  if (window.innerWidth < 1024) return 60
  return 64
}

const getTopbarHeight = () => {
  if (typeof window === 'undefined') return 48
  if (window.innerWidth < 640) return 44
  if (window.innerWidth < 1024) return 46
  return 48
}

const getPanelWidth = () => {
  if (typeof window === 'undefined') return 288
  if (window.innerWidth < 640) return 0
  if (window.innerWidth < 768) return 240
  if (window.innerWidth < 1024) return 260
  return 288
}

export default function Board() {
  const { roomId } = useParams<{ roomId: string }>()
  const { dark } = useTheme()

  const socketRef = useRef<Socket | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef<Point | null>(null)
  const startPoint = useRef<Point | null>(null)
  const history = useRef<ImageData[]>([])
  const redoStack = useRef<ImageData[]>([])
  const canvasImageData = useRef<ImageData | null>(null) // Store canvas content

  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState('#7c3aed')
  const [brushSize, setBrushSize] = useState(4)
  const [userCount, setUserCount] = useState(0)
  const [notes, setNotes] = useState<NoteData[]>([])
  const [cursors, setCursors] = useState<Record<string, CursorData & { name: string; color: string }>>({})
  const [myName, setMyName] = useState('')
  const [myColor, setMyColor] = useState('#7c3aed')
  const [people, setPeople] = useState<Person[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [viewport, setViewport] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1024, 
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  const [isReady, setIsReady] = useState(false) // Track canvas readiness

  const eraserColor = dark ? '#0f0f17' : '#ffffff'
  
  const sidebarW = getSidebarWidth()
  const topbarH = getTopbarHeight()
  const panelW = showPanel ? getPanelWidth() : 0
  
  const canvasWidth = viewport.width - sidebarW - panelW
  const canvasHeight = viewport.height - topbarH

  // Get canvas context with willReadFrequently
  const getCtx = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext('2d', { willReadFrequently: true })
  }, [])

  const getOverlayCtx = useCallback(() => {
    const overlay = overlayRef.current
    if (!overlay) return null
    return overlay.getContext('2d', { willReadFrequently: true })
  }, [])

  // Save canvas content to ref
  const saveCanvasContent = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    try {
      canvasImageData.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    } catch (e) {
      console.log('Could not save canvas content')
    }
  }, [getCtx])

  // Restore canvas content from ref
  const restoreCanvasContent = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx || !canvasImageData.current) return
    try {
      ctx.putImageData(canvasImageData.current, 0, 0)
    } catch (e) {
      console.log('Could not restore canvas content')
    }
  }, [getCtx])

  // Initialize canvas with correct dimensions
  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    // Set canvas dimensions
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    overlay.width = canvasWidth
    overlay.height = canvasHeight

    // Restore content if exists
    if (canvasImageData.current) {
      restoreCanvasContent()
    }

    setIsReady(true)
  }, [canvasWidth, canvasHeight, restoreCanvasContent])

  // Handle resize with content preservation
  useEffect(() => {
    const handleResize = () => {
      // Save current content
      saveCanvasContent()
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      setViewport({ width, height })
      setIsMobile(width < 640)
      
      if (width < 640) {
        setShowPanel(false)
      }
      
      // Restore content after layout update
      requestAnimationFrame(() => {
        restoreCanvasContent()
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [saveCanvasContent, restoreCanvasContent])

  // Handle panel toggle with content preservation
  useEffect(() => {
    if (!isReady) return
    
    // Save current content before panel change
    saveCanvasContent()
    
    // Restore content after panel change
    requestAnimationFrame(() => {
      restoreCanvasContent()
    })
  }, [showPanel, isReady, saveCanvasContent, restoreCanvasContent])

  const saveSnapshot = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    redoStack.current = []
    if (history.current.length > 30) history.current.shift()
    // Also save to ref for persistence
    saveCanvasContent()
  }

  const drawLine = useCallback((ctx: CanvasRenderingContext2D, data: DrawData) => {
    ctx.beginPath()
    ctx.moveTo(data.from.x, data.from.y)
    ctx.lineTo(data.to.x, data.to.y)
    ctx.strokeStyle = data.tool === 'eraser' ? eraserColor : data.color
    ctx.lineWidth = data.tool === 'eraser' ? 24 : data.brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [eraserColor])

  const drawRect = useCallback((ctx: CanvasRenderingContext2D, data: DrawData) => {
    ctx.beginPath()
    ctx.strokeStyle = data.color
    ctx.lineWidth = data.brushSize
    ctx.strokeRect(data.from.x, data.from.y, data.to.x - data.from.x, data.to.y - data.from.y)
  }, [])

  const drawCircle = useCallback((ctx: CanvasRenderingContext2D, data: DrawData) => {
    const rx = (data.to.x - data.from.x) / 2
    const ry = (data.to.y - data.from.y) / 2
    ctx.beginPath()
    ctx.strokeStyle = data.color
    ctx.lineWidth = data.brushSize
    ctx.ellipse(data.from.x + rx, data.from.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI)
    ctx.stroke()
  }, [])

  useEffect(() => {
    if (!roomId) return

    const socket = connectSocket()
    socketRef.current = socket
    socket.emit('join-room', roomId)

    socket.on('connect_error', err => toast.error(err.message || 'Could not connect to board'))
    socket.on('room-error', (message: string) => toast.error(message))
    socket.on('draw', (data: DrawData) => {
      const ctx = getCtx()
      if (!ctx) return
      if (data.tool === 'rectangle') drawRect(ctx, data)
      else if (data.tool === 'circle') drawCircle(ctx, data)
      else drawLine(ctx, data)
      // Save content after remote draw
      saveCanvasContent()
    })
    socket.on('clear', () => {
      const canvas = canvasRef.current
      const ctx = getCtx()
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvasImageData.current = null
      }
    })
    socket.on('user-count', (count: number) => setUserCount(count))
    socket.on('your-identity', ({ name, color }: { name: string; color: string }) => {
      setMyName(name)
      setMyColor(color)
    })
    socket.on('people-update', (p: Person[]) => setPeople(p))
    socket.on('init-notes', (existing: NoteData[]) => setNotes(existing))
    socket.on('note-add', (note: NoteData) => setNotes(prev => [...prev, note]))
    socket.on('note-update', (note: NoteData) => setNotes(prev => prev.map(n => n.id === note.id ? note : n)))
    socket.on('note-delete', (id: string) => setNotes(prev => prev.filter(n => n.id !== id)))
    socket.on('init-messages', (msgs: Message[]) => setMessages(msgs))
    socket.on('chat-message', (msg: Message) => setMessages(prev => [...prev, msg]))
    socket.on('cursor-move', ({ id, x, y, name, color }: { id: string } & CursorData & { name: string; color: string }) => {
      setCursors(prev => ({ ...prev, [id]: { x, y, name, color } }))
    })
    socket.on('cursor-leave', (id: string) => {
      setCursors(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    })

    return () => {
      socket.emit('leave-room', roomId)
      socket.off()
      socket.disconnect()
    }
  }, [roomId, drawLine, drawRect, drawCircle, saveCanvasContent, getCtx])

  const startDrawing = (e: React.MouseEvent) => {
    if (tool === 'select') return
    e.preventDefault()
    saveSnapshot()
    isDrawing.current = true
    const rect = e.currentTarget.getBoundingClientRect()
    const point = { 
      x: e.nativeEvent.clientX - rect.left, 
      y: e.nativeEvent.clientY - rect.top 
    }
    lastPoint.current = point
    startPoint.current = point
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current || !lastPoint.current || !startPoint.current) return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const cur = { 
      x: e.nativeEvent.clientX - rect.left, 
      y: e.nativeEvent.clientY - rect.top 
    }

    if (tool === 'pen' || tool === 'eraser') {
      const ctx = getCtx()
      if (!ctx) return
      const data: DrawData = { from: lastPoint.current, to: cur, color, brushSize, tool }
      drawLine(ctx, data)
      socketRef.current?.emit('draw', data)
      lastPoint.current = cur
      return
    }

    const overlayCtx = getOverlayCtx()
    const overlay = overlayRef.current
    if (!overlayCtx || !overlay) return
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
    const data: DrawData = { from: startPoint.current, to: cur, color, brushSize, tool }
    if (tool === 'line') drawLine(overlayCtx, data)
    else if (tool === 'rectangle') drawRect(overlayCtx, data)
    else if (tool === 'circle') drawCircle(overlayCtx, data)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    socketRef.current?.emit('cursor-move', { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    draw(e)
  }

  const stopDrawing = (e: React.MouseEvent) => {
    if (!isDrawing.current || !startPoint.current) return
    isDrawing.current = false
    const rect = e.currentTarget.getBoundingClientRect()
    const cur = { 
      x: e.nativeEvent.clientX - rect.left, 
      y: e.nativeEvent.clientY - rect.top 
    }

    if (tool === 'line' || tool === 'rectangle' || tool === 'circle') {
      const ctx = getCtx()
      const overlayCtx = getOverlayCtx()
      const overlay = overlayRef.current
      if (!ctx || !overlayCtx || !overlay) return
      const data: DrawData = { from: startPoint.current, to: cur, color, brushSize, tool }
      if (tool === 'line') drawLine(ctx, data)
      else if (tool === 'rectangle') drawRect(ctx, data)
      else drawCircle(ctx, data)
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
      socketRef.current?.emit('draw', data)
      // Save content after drawing
      saveCanvasContent()
    }

    lastPoint.current = null
    startPoint.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    saveSnapshot()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvasImageData.current = null
    socketRef.current?.emit('clear')
    toast.success('Canvas cleared')
  }

  const undoCanvas = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx || !history.current.length) return
    redoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(history.current.pop()!, 0, 0)
    saveCanvasContent()
  }

  const redoCanvas = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx || !redoStack.current.length) return
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(redoStack.current.pop()!, 0, 0)
    saveCanvasContent()
  }

  const addNote = () => {
    const note: NoteData = {
      id: Date.now().toString(),
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      text: '',
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    }
    setNotes(prev => [...prev, note])
    socketRef.current?.emit('note-add', note)
  }

  const moveNote = (id: string, x: number, y: number) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, x, y } : note))
    const note = notes.find(item => item.id === id)
    if (note) socketRef.current?.emit('note-update', { ...note, x, y })
  }

  const updateNoteText = (id: string, text: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, text } : note))
    const note = notes.find(item => item.id === id)
    if (note) socketRef.current?.emit('note-update', { ...note, text })
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    socketRef.current?.emit('note-delete', id)
  }

  const getCursor = () => {
    if (tool === 'eraser') return 'cell'
    if (tool === 'select') return 'default'
    return 'crosshair'
  }

  const togglePanel = () => {
    setShowPanel(prev => !prev)
  }

  return (
    <div className={`w-screen h-screen overflow-hidden ${dark ? 'bg-[#0f0f17]' : 'bg-white'}`}>
      <Toolbar
        tool={tool}
        color={color}
        brushSize={brushSize}
        onToolChange={setTool}
        onColorChange={setColor}
        onBrushSizeChange={setBrushSize}
        onUndo={undoCanvas}
        onRedo={redoCanvas}
        onClear={clearCanvas}
        onAddNote={addNote}
      />

      <TopBar roomId={roomId || ''} userCount={userCount} myName={myName} myColor={myColor} people={people} />

      <div 
        className="absolute overflow-hidden"
        style={{ 
          left: sidebarW, 
          top: topbarH, 
          right: showPanel ? panelW : 0, 
          bottom: 0,
          background: dark ? '#0f0f17' : '#ffffff'
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.055)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`, 
            backgroundSize: '28px 28px' 
          }} 
        />
        <canvas 
          ref={canvasRef} 
          width={canvasWidth} 
          height={canvasHeight} 
          className="absolute top-0 left-0 w-full h-full" 
          style={{ background: 'transparent' }} 
        />
        <canvas
          ref={overlayRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="absolute top-0 left-0 w-full h-full touch-none"
          style={{ cursor: getCursor() }}
        />

        {notes.map(note => (
          <StickyNote key={note.id} {...note} onMove={moveNote} onTextChange={updateNoteText} onDelete={deleteNote} />
        ))}

        <AnimatePresence>
          {Object.entries(cursors).map(([id, cursor]) => (
            <LiveCursor key={id} {...cursor} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPanel && (
          <RightPanel 
            people={people} 
            messages={messages} 
            myName={myName} 
            onSendMessage={text => socketRef.current?.emit('chat-message', text)} 
            onClose={togglePanel}
          />
        )}
      </AnimatePresence>

      {!isMobile && (
        <button 
          onClick={togglePanel}
          className={`fixed bottom-4 z-20 w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-105 ${
            showPanel ? 'right-[260px] md:right-[280px] lg:right-[308px]' : 'right-4'
          }`}
        >
          <MessageCircle size={14} />
        </button>
      )}

      {isMobile && !showPanel && (
        <button 
          onClick={togglePanel}
          className="fixed right-4 bottom-4 z-20 w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-105"
        >
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  )
}


