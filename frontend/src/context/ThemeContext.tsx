import { createContext, useEffect, useState, type PropsWithChildren } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext({} as ThemeContextProps);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const getUserTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'dark' || stored === 'light') return stored
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  }

  const [theme, setTheme] = useState<Theme>(getUserTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

