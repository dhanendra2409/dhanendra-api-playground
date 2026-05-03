"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"

export interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    try {
      setLoading(true)
      const data = await apiFetch("/auth/me/")
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMe()
  }, [])

  const login = async (data: any) => {
    const userData = await apiFetch("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    })
    setUser(userData)
  }

  const register = async (data: any) => {
    const userData = await apiFetch("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    })
    setUser(userData)
  }

  const logout = async () => {
    try {
      await apiFetch("/auth/logout/", { method: "POST" })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
