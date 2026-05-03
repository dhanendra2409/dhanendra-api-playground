"use client"

import React, { useState } from "react"
import { Send, Save, Share, Copy, Check, Clock, Globe, Zap, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { apiFetch } from "@/lib/api"

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]

export function Workbench() {
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [reqHeaders, setReqHeaders] = useState<Record<string, string>>({ "Content-Type": "application/json" })
  const [reqBody, setReqBody] = useState("")
  const { toast } = useToast()

  const handleSend = async () => {
    setIsLoading(true)
    
    try {
      // Perform actual fetch
      const startTime = Date.now();
      const fetchOptions: RequestInit = {
        method,
        headers: reqHeaders,
      };
      
      if (method !== "GET" && method !== "HEAD" && reqBody) {
        fetchOptions.body = reqBody;
      }

      const res = await fetch(url, fetchOptions);
      const endTime = Date.now();
      
      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = await res.text();
      }
      
      const mockResponse = {
        status: res.status,
        statusText: res.statusText,
        time: `${endTime - startTime}ms`,
        size: `${typeof responseData === "string" ? responseData.length : JSON.stringify(responseData).length} bytes`,
        headers: Object.fromEntries(res.headers.entries()),
        body: typeof responseData === "string" ? responseData : JSON.stringify(responseData, null, 2)
      };

      setResponse(mockResponse);

      // Save to DRF Backend History
      await apiFetch("/requests/", {
        method: "POST",
        body: JSON.stringify({
          method,
          url,
          headers: reqHeaders,
          body: reqBody,
          response: mockResponse,
          is_favorite: false
        })
      });

      toast({
        title: "Request Sent",
        description: `Successfully received response from ${url}`,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "There was an error sending your request.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Response body copied to clipboard",
    });
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b space-y-4">
        <div className="flex gap-2">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-32 font-bold text-sm bg-accent/50 border-none h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((m) => (
                <SelectItem key={m} value={m} className="font-bold">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter request URL" 
            className="flex-1 font-code text-sm h-11 border-none bg-accent/30 focus-visible:ring-1"
          />
          <Button onClick={handleSend} disabled={isLoading} size="lg" className="px-8 h-11 font-semibold group shadow-lg">
            {isLoading ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            )}
            Send
          </Button>
          <Button variant="outline" size="icon" className="h-11 w-11">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col border-r">
          <Tabs defaultValue="params" className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="bg-transparent h-12 p-0 gap-6">
                <TabsTrigger value="params" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12">Params</TabsTrigger>
                <TabsTrigger value="headers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12">Headers</TabsTrigger>
                <TabsTrigger value="body" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12">Body</TabsTrigger>
                <TabsTrigger value="auth" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12">Auth</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="flex-1 p-4 bg-muted/10">
              <TabsContent value="params" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">Query Parameters</h3>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Bulk Edit</Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Key" className="bg-background h-9 text-xs" />
                  <Input placeholder="Value" className="bg-background h-9 text-xs" />
                </div>
              </TabsContent>

              <TabsContent value="headers" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">HTTP Headers</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Content-Type" defaultValue="application/json" className="bg-background h-9 text-xs" />
                  <Input placeholder="Value" defaultValue="application/json" className="bg-background h-9 text-xs" />
                </div>
              </TabsContent>

              <TabsContent value="body" className="m-0 flex flex-col h-full gap-4">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="cursor-pointer">raw</Badge>
                  <Badge variant="outline" className="opacity-50 cursor-pointer">form-data</Badge>
                  <Badge variant="outline" className="opacity-50 cursor-pointer">binary</Badge>
                  <div className="ml-auto">
                    <Select defaultValue="json">
                      <SelectTrigger className="w-24 h-7 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea 
                  placeholder='{ "key": "value" }'
                  value={reqBody}
                  onChange={(e) => setReqBody(e.target.value)}
                  className="flex-1 min-h-[300px] font-code text-sm bg-background/50 border-none resize-none focus-visible:ring-1"
                />
              </TabsContent>

              <TabsContent value="auth" className="m-0">
                <div className="py-10 text-center space-y-2">
                  <Settings2 className="w-10 h-10 mx-auto text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No authentication method selected</p>
                  <Button variant="outline" size="sm">Choose Type</Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {!response && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                <Globe className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Send a request to see response</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Enter a URL and click Send to start debugging your API endpoint.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setUrl("https://jsonplaceholder.typicode.com/posts/1")}>Try example</Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <Zap className="w-12 h-12 text-primary animate-pulse" />
              <p className="text-sm text-muted-foreground animate-pulse">Requesting from server...</p>
            </div>
          ) : (
            <Tabs defaultValue="body" className="flex-1 flex flex-col">
              <div className="border-b px-4 flex items-center justify-between">
                <TabsList className="bg-transparent h-12 p-0 gap-6">
                  <TabsTrigger value="body" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12">Response Body</TabsTrigger>
                  <TabsTrigger value="headers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12">Headers</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 text-xs font-medium">
                     <span className="text-muted-foreground">Status:</span>
                     <span className={response.status < 400 ? "text-green-500" : "text-destructive"}>{response.status} {response.statusText}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs font-medium">
                     <span className="text-muted-foreground">Time:</span>
                     <span className="text-primary">{response.time}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs font-medium">
                     <span className="text-muted-foreground">Size:</span>
                     <span className="text-primary">{response.size}</span>
                   </div>
                </div>
              </div>

              <ScrollArea className="flex-1 bg-muted/10 p-4">
                <TabsContent value="body" className="m-0">
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-accent/50"
                      onClick={() => copyToClipboard(response.body)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre className="code-editor text-sm p-4 rounded-lg bg-card border overflow-x-auto">
                      <code className="block whitespace-pre">
                        {response.body}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="headers" className="m-0">
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-muted-foreground">Header</th>
                          <th className="px-4 py-2 text-left font-medium text-muted-foreground">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(response.headers).map(([key, value]: any) => (
                          <tr key={key} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                            <td className="px-4 py-2 font-medium text-foreground/70">{key}</td>
                            <td className="px-4 py-2 font-code text-primary/80">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
