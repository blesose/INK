
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, LogOut, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import Avatar from '../components/Avatar'
import type { Board } from '../types/index'
import api from '../lib/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { dark } = useTheme()
  const navigate = useNavigate()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [joinId, setJoinId] = useState('')
  const [showJoin, setShowJoin] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const t = {
    bg: dark ? '#05050a' : '#f4f4f8',
    text: dark ? '#ffffff' : '#0a0a0f',
    muted: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)',
    card: dark ? 'rgba(255,255,255,0.03)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    navBg: dark ? 'rgba(5,5,10,0.8)' : 'rgba(244,244,248,0.8)',
    inputBg: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    inputBorder: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)',
    modalBg: dark ? '#0f0f17' : '#ffffff',
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const res = await api.get('/api/boards')
      setBoards(res.data.boards)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load boards')
    } finally {
      setLoading(false)
    }
  }

  const createBoard = async () => {
    if (creating) return

    setCreating(true)
    try {
      const res = await api.post('/api/boards', { name: newBoardName.trim() || 'Untitled Board' })
      setBoards(prev => [res.data.board, ...prev])
      setShowModal(false)
      setNewBoardName('')
      toast.success(`Board "${res.data.board.name}" created!`)
      navigate(`/board/${res.data.board.roomId}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to create board')
    } finally {
      setCreating(false)
    }
  }

  // Updated delete function with toast confirmation
  const deleteBoard = async (roomId: string, boardName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Show confirmation toast
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px 0' }}>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>
          Delete "{boardName}"?
        </div>
        <div style={{ fontSize: '13px', opacity: 0.7 }}>
          This action cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={() => {
              toast.dismiss(t.id)
              performDelete(roomId)
            }}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000, // Keep toast open until user acts
      style: {
        background: dark ? '#1a1a24' : '#ffffff',
        color: dark ? '#ffffff' : '#0a0a0f',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '12px',
        padding: '16px',
        minWidth: '280px',
        maxWidth: '340px',
      },
    })
  }

  // Actual delete function
  const performDelete = async (roomId: string) => {
    setDeleting(roomId)
    try {
      await api.delete(`/api/boards/${roomId}`)
      setBoards(prev => prev.filter(board => board.roomId !== roomId))
      toast.success('Board deleted successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete board')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const joinBoard = () => {
    const trimmed = joinId.trim().toUpperCase()
    if (trimmed) {
      navigate(`/board/${trimmed}`)
      setShowJoin(false)
      setJoinId('')
    } else {
      toast.error('Please enter a valid room ID')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Signed out successfully')
    } catch (err) {
      toast.error('Failed to sign out')
    }
  }

  const BOARD_COLORS = [
    ['#7c3aed', '#db2777'],
    ['#2563eb', '#7c3aed'],
    ['#059669', '#2563eb'],
    ['#d97706', '#db2777'],
  ]

  return (
    <>
      <style>{`
        .board-card { border-radius: 16px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
        .board-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
        .delete-btn { 
          position: absolute; 
          top: 10px; 
          right: 10px; 
          background: rgba(0,0,0,0.5); 
          border: none; 
          color: rgba(255,255,255,0.8); 
          cursor: pointer; 
          padding: 6px 8px; 
          border-radius: 8px; 
          transition: all 0.15s; 
          opacity: 0; 
          backdrop-filter: blur(4px);
          z-index: 5;
        }
        .board-card:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { background: rgba(239,68,68,0.9); color: #fff; transform: scale(1.05); }
        .delete-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none !important; }
        .new-board-btn { border-radius: 16px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 180px; border: 2px dashed; }
        .new-board-btn:hover { transform: translateY(-3px); }
        .ink-input { width: 100%; padding: 13px 16px; border-radius: 12px; font-size: 15px; outline: none; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .ink-input:focus { border-color: rgba(124,58,237,0.6) !important; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(6px); }
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'DM Sans',sans-serif", color: t.text, transition: 'all 0.3s' }}>
        <nav style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${t.border}`, background: t.navBg, backdropFilter: 'blur(16px)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>I</span>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '18px' }}>INK</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThemeToggle />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: '20px', padding: '5px 12px 5px 5px', border: `1px solid ${t.border}`, maxWidth: 220 }}>
              <Avatar name={user?.name} avatar={user?.avatar} size={26} />
              <span style={{ fontSize: '13px', color: t.text, fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '8px', color: t.muted, cursor: 'pointer', padding: '7px 10px', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: '30px', fontWeight: '800', marginBottom: '6px' }}>Your Boards</h1>
              <p style={{ color: t.muted, fontSize: '14px' }}>{boards.length} board{boards.length !== 1 ? 's' : ''}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowJoin(true)} style={{ padding: '10px 18px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '10px', color: t.muted, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <LinkIcon size={15} /> Join Room
              </button>
              <button onClick={() => setShowModal(true)} style={{ padding: '10px 18px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={16} /> New Board
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: t.muted, padding: '80px 0', fontSize: '15px' }}>Loading your boards...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
              <button className="new-board-btn" onClick={() => setShowModal(true)} style={{ background: dark ? 'rgba(124,58,237,0.05)' : 'rgba(124,58,237,0.03)', borderColor: dark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                <Plus size={28} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>New Board</span>
              </button>

              {boards.map((board, i) => {
                const [c1, c2] = BOARD_COLORS[i % BOARD_COLORS.length]
                const isDeleting = deleting === board.roomId
                
                return (
                  <div 
                    key={board.id} 
                    className="board-card" 
                    style={{ background: t.card, border: `1px solid ${t.border}`, opacity: isDeleting ? 0.5 : 1 }} 
                    onClick={() => navigate(`/board/${board.roomId}`)}
                  >
                    <button 
                      className="delete-btn" 
                      onClick={(e) => deleteBoard(board.roomId, board.name, e)} 
                      title="Delete board"
                      disabled={isDeleting}
                    >
                      {isDeleting ? '...' : <Trash2 size={14} />}
                    </button>
                    <div style={{ height: '120px', background: `linear-gradient(135deg,${c1}22,${c2}15)`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ fontFamily: 'cursive', fontSize: '22px', color: c1, opacity: 0.5, transform: 'rotate(-8deg)', maxWidth: '85%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.name}</div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: t.muted }}>Updated {formatDate(board.updatedAt)}</span>
                        <span style={{ fontSize: '10px', color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.2)', fontWeight: '600' }}>{board.roomId}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '32px', width: '380px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '800', marginBottom: '6px', color: t.text }}>New Board</h2>
            <input className="ink-input" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createBoard()} placeholder="e.g. Design Review" autoFocus style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, margin: '18px 0 16px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '10px', color: t.muted, cursor: 'pointer' }}>Cancel</button>
              <button onClick={createBoard} disabled={creating} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>{creating ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="modal-overlay" onClick={() => setShowJoin(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '32px', width: '380px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '800', marginBottom: '6px', color: t.text }}>Join a Board</h2>
            <input className="ink-input" value={joinId} onChange={e => setJoinId(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && joinBoard()} placeholder="e.g. 7X8K3A" autoFocus style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, margin: '18px 0 16px', letterSpacing: '0.1em', fontWeight: '600' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowJoin(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '10px', color: t.muted, cursor: 'pointer' }}>Cancel</button>
              <button onClick={joinBoard} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Join</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}