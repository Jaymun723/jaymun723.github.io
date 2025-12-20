import React from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

const ThemeToggler = () => {
  const [theme, setTheme] = React.useState(null)

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  React.useEffect(() => {
    if (theme) {
      document.body.className = theme
      window.localStorage.setItem('theme', theme)
    }
  }, [theme])

  if (!theme) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--color-text)',
        padding: '0.5rem',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '0.5rem'
      }}
    >
      {theme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  )
}

export default ThemeToggler