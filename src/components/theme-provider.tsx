
"use client"

import * as React from "react"

type Theme = "light" | "dark" | "greenish"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("dark")

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "greenish")
    root.classList.add(theme)
    localStorage.setItem("app-theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useAppTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error("useAppTheme must be used within ThemeProvider")
  return context
}
