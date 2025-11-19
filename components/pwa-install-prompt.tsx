'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">Install CHONKPUMP 9000</h3>
          <p className="text-xs opacity-90">Get the app on your device for faster access and offline support</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="bg-white text-purple-600 hover:bg-gray-100 text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
