"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
      setShowPrompt(false)
    }
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-slate-800 border-slate-700 shadow-lg z-50">
      <CardContent className="pt-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white font-semibold text-sm">Install ChonkPump</p>
            <p className="text-slate-400 text-xs">Get instant access on all your devices</p>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Download className="w-3 h-3 mr-1" />
            Install
          </Button>
          <Button
            onClick={() => setShowPrompt(false)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
