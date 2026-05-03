"use client"

import React, { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, Lock, Mail, User, ShieldCheck } from "lucide-react"

export function AuthScreen() {
  const { login, register } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Login form state
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [regUsername, setRegUsername] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginUsername || !loginPassword) return
    try {
      setError("")
      setLoading(true)
      await login({ username: loginUsername, password: loginPassword })
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regUsername || !regPassword) return
    try {
      setError("")
      setLoading(true)
      await register({ username: regUsername, email: regEmail, password: regPassword })
    } catch (err: any) {
      setError(err.message || "Failed to register. Username may be taken.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 p-4 select-none relative overflow-hidden">
      {/* Dynamic background highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl backdrop-blur-md shadow-2xl animate-pulse">
            <Terminal className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-headline">
            API Workbench
          </h1>
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            Develop and test your APIs seamlessly
          </p>
        </div>

        <Card className="border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden duration-300 hover:shadow-indigo-500/5 hover:border-slate-700/80">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none h-12 bg-slate-950/40 border-b border-slate-800/60 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-300 font-medium text-slate-400 rounded-lg transition-all duration-300">
                Log In
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-300 font-medium text-slate-400 rounded-lg transition-all duration-300">
                Register
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-6 pt-5">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-300">
                  {error}
                </div>
              )}

              <TabsContent value="login" className="mt-0 outline-none">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-username" className="text-xs font-semibold text-slate-300">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="your-username"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="pl-10 h-11 bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/30 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-xs font-semibold text-slate-300">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 h-11 bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/30 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-2 group">
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-slate-200/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ShieldCheck className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0 outline-none">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-username" className="text-xs font-semibold text-slate-300">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="reg-username"
                        type="text"
                        placeholder="your-username"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="pl-10 h-11 bg-slate-950/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/30 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email" className="text-xs font-semibold text-slate-300">Email (optional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="pl-10 h-11 bg-slate-950/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/30 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className="text-xs font-semibold text-slate-300">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="pl-10 h-11 bg-slate-950/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/30 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2 group">
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-slate-200/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ShieldCheck className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
