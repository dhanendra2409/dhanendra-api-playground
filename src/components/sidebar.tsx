"use client"

import React, { useState, useEffect } from "react"
import { History, FolderPlus, Folder, Plus, ChevronRight, Search, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("history")
  const [search, setSearch] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [collectionsLoading, setCollectionsLoading] = useState(false)

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true)
      const data = await apiFetch("/requests/")
      setHistory(Array.isArray(data) ? data : [])
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true)
      const data = await apiFetch("/collections/")
      setCollections(Array.isArray(data) ? data : [])
    } catch {
      setCollections([])
    } finally {
      setCollectionsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
    fetchCollections()
  }, [])

  const handleCreateCollection = async () => {
    const name = prompt("Collection Name:")
    if (name) {
      try {
        await apiFetch("/collections/", {
          method: "POST",
          body: JSON.stringify({ name })
        })
        fetchCollections()
      } catch (err: any) {
        alert(err.message || "Failed to create collection")
      }
    }
  }

  const filteredHistory = (history || []).filter(item =>
    item.url.toLowerCase().includes(search.toLowerCase()) ||
    item.method.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCollections = (collections || []).filter(col =>
    col.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="w-72 flex flex-col bg-card border-r">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Workspace</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search requests..." 
            className="pl-8 h-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="history" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="px-4 py-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="history" className="text-xs" onClick={fetchHistory}>
              <History className="h-3 w-3 mr-1" /> History
            </TabsTrigger>
            <TabsTrigger value="collections" className="text-xs" onClick={fetchCollections}>
              <Folder className="h-3 w-3 mr-1" /> Collections
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="history" className="m-0 p-2 space-y-1">
            {historyLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-8">No history yet</p>
            ) : (
              filteredHistory.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left p-2 rounded-md hover:bg-accent group transition-colors flex flex-col gap-1 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={cnMethodColor(item.method)}>
                      {item.method}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.timestamp ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  <span className="text-xs truncate font-code text-foreground/80">{item.url}</span>
                </button>
              ))
            )}
          </TabsContent>

          <TabsContent value="collections" className="m-0 p-2 space-y-1">
            {collectionsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCollections.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-8">No collections</p>
            ) : (
              filteredCollections.map((col) => (
                <button
                  key={col.id}
                  className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{col.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{col.request_count}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))
            )}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-xs text-muted-foreground mt-4 h-8 px-2"
              onClick={handleCreateCollection}
            >
              <FolderPlus className="h-4 w-4 mr-2" /> Create Collection
            </Button>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <div className="p-4 border-t bg-muted/30">
        <Button variant="ghost" className="w-full justify-start text-xs h-8">
          <Star className="h-4 w-4 mr-2 text-yellow-500" /> Favorites
        </Button>
      </div>
    </aside>
  )
}

function cnMethodColor(method: string) {
  switch (method?.toUpperCase()) {
    case 'GET': return 'text-green-500 border-green-500/30 bg-green-500/5'
    case 'POST': return 'text-blue-500 border-blue-500/30 bg-blue-500/5'
    case 'PUT': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5'
    case 'PATCH': return 'text-orange-500 border-orange-500/30 bg-orange-500/5'
    case 'DELETE': return 'text-red-500 border-red-500/30 bg-red-500/5'
    default: return ''
  }
}
