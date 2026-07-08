import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  dark: boolean
  toggleTheme: () => void
  setTheme: (mode: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('ink_theme')
    if (saved) {
      return saved === 'dark'
    }
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('ink_theme', dark ? 'dark' : 'light')
    
    // Update document body background
    document.body.style.background = dark ? '#05050a' : '#f8f8fc'
    document.body.style.color = dark ? '#ffffff' : '#0a0a0f'
    
    // Update html class for Tailwind dark mode
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', dark ? '#05050a' : '#f8f8fc')
    }
  }, [dark])

  const toggleTheme = () => setDark(prev => !prev)

  const setTheme = (mode: 'light' | 'dark') => {
    setDark(mode === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext