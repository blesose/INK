import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Users } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import type { Message } from '../../types/index'
import Avatar from '../Avatar'

interface Person {
  id: string
  name: string
  color: string
  avatar: string
}

interface Props {
  people: Person[]
  messages: Message[]
  myName: string
  onSendMessage: (text: string) => void
  onClose: () => void
}

export default function RightPanel({ people, messages, myName, onSendMessage, onClose }: Props) {
  const { dark } = useTheme()
  const [tab, setTab] = useState<'people' | 'chat'>('people')
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    onSendMessage(input.trim())
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed right-0 top-12 bottom-0 w-72 z-20 flex flex-col border-l ${
        dark ? 'bg-[#0f0f17]/95 border-white/8' : 'bg-white/95 border-black/8'
      } backdrop-blur-xl`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${dark ? 'border-white/8' : 'border-black/8'}`}>
        <div className="flex gap-1">
          {(['people', 'chat'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                tab === t
                  ? 'bg-violet-500/15 text-violet-400'
                  : dark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'
              }`}
            >
              {t === 'people' ? <Users size={12} /> : <MessageCircle size={12} />}
              {t === 'people' ? `People (${people.length})` : 'Chat'}
            </button>
          ))}
        </div>
        <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${dark ? 'text-white/30 hover:text-white/60' : 'text-black/30 hover:text-black/60'}`}>
          <X size={14} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'people' ? (
          <motion.div
            key="people"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-3 space-y-2"
          >
            {people.map(p => (
              <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl ${dark ? 'bg-white/3 hover:bg-white/5' : 'bg-black/3 hover:bg-black/5'} transition-colors`}>
                <Avatar
                              key={p.id}
                              name={p.name}
                              avatar={p.avatar}
                              color={p.color}
                              size={28}
                              className="ring-2 ring-[#0f0f17]"
                            />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-[#0a0a0f]'}`}>
                    {p.name}
                    {p.name === myName && (
                      <span className="ml-1.5 text-[10px] text-violet-400 font-normal">(you)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className={`text-[10px] ${dark ? 'text-white/35' : 'text-black/40'}`}>Online</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className={`text-center text-xs mt-8 ${dark ? 'text-white/25' : 'text-black/30'}`}>
                  No messages yet. Say hi! 👋
                </div>
              )}
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.name === myName ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: msg.color }}
                  >
                    {msg.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className={`max-w-[75%] ${msg.name === myName ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                    <span className={`text-[10px] ${dark ? 'text-white/30' : 'text-black/40'}`}>
                      {msg.name === myName ? 'You' : msg.name}
                    </span>
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        msg.name === myName
                          ? 'bg-violet-600 text-white rounded-tr-sm'
                          : dark ? 'bg-white/8 text-white rounded-tl-sm' : 'bg-black/6 text-[#0a0a0f] rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-3 border-t ${dark ? 'border-white/8' : 'border-black/8'}`}>
              <div className={`flex gap-2 items-center px-3 py-2 rounded-xl border ${dark ? 'bg-white/4 border-white/8' : 'bg-black/3 border-black/8'}`}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className={`flex-1 bg-transparent text-xs outline-none ${dark ? 'text-white placeholder:text-white/25' : 'text-[#0a0a0f] placeholder:text-black/30'}`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center disabled:opacity-40 flex-shrink-0"
                >
                  <Send size={11} color="white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
