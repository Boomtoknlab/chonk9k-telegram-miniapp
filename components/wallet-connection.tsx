"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Lock, Users, Shield, AlertCircle, Loader, TrendingUp } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getTokenBalance, determineTier, formatTokenAmount } from "@/lib/solana-utils"
import { getUserStats, saveUserStats } from "@/lib/gamification-utils"

interface WalletConnectionProps {
  onConnected: (address: string, tier: "bronze" | "silver" | "gold" | null) => void
}

export function WalletConnection({ onConnected }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined" && (window as any).solana) {
        try {
          const response = await (window as any).solana.connect({ onlyIfTrusted: true })
          const address = response.publicKey.toString()
          
          setIsVerifying(true)
          const balance = await getTokenBalance(address)
          const tier = determineTier(balance)
          
          if (tier) {
            const existingStats = getUserStats(address)
            if (!existingStats.referralCode) {
              existingStats.tier = tier
              existingStats.tokenBalance = balance
              saveUserStats(existingStats)
            }
          }
          
          setIsVerifying(false)
          onConnected(address, tier)
        } catch (err) {
          console.log("[ChonkPump] No wallet connected yet")
          setIsVerifying(false)
        }
      }
    }
    checkWalletConnection()
  }, [onConnected])

  const handleConnect = async () => {
    setIsConnecting(true)
    setError("")
    
    try {
      if (typeof window === "undefined" || !(window as any).solana) {
        setError("Please install Phantom or Solflare wallet extension")
        setIsConnecting(false)
        return
      }

      const response = await (window as any).solana.connect()
      const walletAddress = response.publicKey.toString()

      setIsVerifying(true)
      const balance = await getTokenBalance(walletAddress)
      const tier = determineTier(balance)
      
      if (tier === null) {
        setError(`Insufficient token balance. You have ${formatTokenAmount(balance)} CHONK tokens. Please hold at least 100 tokens to join.`)
        setIsVerifying(false)
        setIsConnecting(false)
        return
      }

      const userStats = getUserStats(walletAddress)
      userStats.tier = tier
      userStats.tokenBalance = balance
      userStats.joinedAt = new Date()
      saveUserStats(userStats)

      onConnected(walletAddress, tier)
      setIsVerifying(false)
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
      setIsVerifying(false)
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image 
              src="/chonkpump-logo.png" 
              alt="ChonkPump 9000" 
              width={120} 
              height={120}
              priority
              className="drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              ChonkPump 9000
            </h1>
            <p className="text-slate-400 text-sm">Solana Token-Gated Community</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-900 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-200" />
            <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Card */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Welcome</CardTitle>
            <CardDescription>Connect your Solana wallet to verify CHONK token ownership and join the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Lock className="w-5 h-5 text-emerald-500 mt-0.5" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Token-Gated Access</p>
                  <p className="text-slate-400 text-xs">Verified CHONK token ownership required</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Users className="w-5 h-5 text-emerald-500 mt-0.5" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Exclusive Community</p>
                  <p className="text-slate-400 text-xs">Connect with token holders worldwide</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Shield className="w-5 h-5 text-emerald-500 mt-0.5" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Tiered Rewards</p>
                  <p className="text-slate-400 text-xs">More tokens unlock premium features</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-500 mt-0.5" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Earn & Grow</p>
                  <p className="text-slate-400 text-xs">Daily rewards, leaderboards, and referrals</p>
                </div>
              </div>
            </div>

            {/* Tiers Preview */}
            <div className="bg-slate-900 rounded-lg p-4 space-y-3 border border-slate-700">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Membership Tiers</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                  <span className="text-slate-300 font-medium">Bronze</span>
                  <span className="text-orange-400 text-xs font-semibold">100-499 CHONK</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                  <span className="text-slate-300 font-medium">Silver</span>
                  <span className="text-slate-300 text-xs font-semibold">500-999 CHONK</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                  <span className="text-slate-300 font-medium">Gold</span>
                  <span className="text-yellow-400 text-xs font-semibold">1000+ CHONK</span>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <Button
              onClick={handleConnect}
              disabled={isConnecting || isVerifying}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-11"
            >
              {isVerifying ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Verifying tokens...
                </>
              ) : isConnecting ? (
                "Connecting..."
              ) : (
                "Connect Wallet"
              )}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              We recommend Phantom or Solflare for the best experience
            </p>
          </CardContent>
        </Card>

        {/* Contract Info */}
        <div className="text-center space-y-1">
          <p className="text-xs text-slate-500">Token Contract</p>
          <p className="text-xs font-mono text-slate-400 break-all">DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump</p>
        </div>
      </div>
    </div>
  )
}
