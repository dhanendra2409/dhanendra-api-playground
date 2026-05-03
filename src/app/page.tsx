"use client"

import React from "react"
import { useAuth } from "@/components/auth-provider"
import { AuthScreen } from "@/components/auth-screen"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Workbench } from "@/components/workbench"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-4 select-none">
        <span className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium tracking-wider animate-pulse">Loading Workbench...</span>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden border-l">
            <Workbench />
          </main>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
