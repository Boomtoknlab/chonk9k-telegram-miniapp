"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { WalletConnection } from "@/components/wallet-connection"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [userTier, setUserTier] = useState<"bronze" | "silver" | "gold" | null>(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    const storedTier = localStorage.getItem("userTier") as "bronze" | "silver" | "gold" | null
    
    if (storedAddress && storedTier) {
      setConnected(true)
      setWalletAddress(storedAddress)
      setUserTier(storedTier)
    }
    setIsLoading(false)
    
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-community-data').catch(() => {
          console.log('[v0] Background sync registration not supported');
        });
      });
    }
  }, [])

  const handleConnected = (address: string, tier: "bronze" | "silver" | "gold" | null) => {
    if (tier === null) {
      return
    }
    setConnected(true)
    setWalletAddress(address)
    setUserTier(tier)
    localStorage.setItem("walletAddress", address)
    localStorage.setItem("userTier", tier)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image src="/chonkpump-logo.png" alt="ChonkPump" width={120} height={120} priority />
          <div className="text-white animate-pulse">Loading CHONKPUMP 9000...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {!connected ? (
        <WalletConnection onConnected={handleConnected} />
      ) : (
        <Dashboard walletAddress={walletAddress} userTier={userTier || "bronze"} />
      )}
    </main>
  )
}
