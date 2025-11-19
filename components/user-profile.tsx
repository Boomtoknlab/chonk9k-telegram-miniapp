"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle2, TrendingUp, Award, Zap } from 'lucide-react'
import { useState } from "react"

interface UserProfileProps {
  walletAddress: string
  userTier: "bronze" | "silver" | "gold"
}

export function UserProfile({ walletAddress, userTier }: UserProfileProps) {
  const [copied, setCopied] = useState(false)

  const userStats = {
    bronze: { balance: 350, posts: 12, votes: 45, joinDate: "Oct 2024" },
    silver: { balance: 750, posts: 34, votes: 128, joinDate: "Aug 2024" },
    gold: { balance: 2500, posts: 89, votes: 412, joinDate: "Jun 2024" },
  }

  const stats = userStats[userTier]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "gold":
        return "bg-yellow-500 text-black"
      case "silver":
        return "bg-slate-400 text-black"
      case "bronze":
        return "bg-orange-500 text-white"
      default:
        return "bg-slate-600"
    }
  }

  const getTierBenefits = (tier: string) => {
    switch (tier) {
      case "gold":
        return ["Governance voting", "VIP events", "Exclusive content", "Forums & chat"]
      case "silver":
        return ["Exclusive content", "Weekly AMAs", "Forums & chat"]
      case "bronze":
        return ["Forums", "Community chat"]
      default:
        return []
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <div>
              <p className="text-white font-semibold">Community Member</p>
              <Badge className={getTierColor(userTier)}>
                {userTier.toUpperCase()} TIER
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Joined</p>
            <p className="text-white font-semibold text-sm">{stats.joinDate}</p>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-slate-900 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-300 uppercase">Wallet Address</p>
          <div className="flex items-center justify-between bg-slate-800 rounded p-3 font-mono text-sm text-slate-300">
            <span>{walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</span>
            <button
              onClick={handleCopyAddress}
              className="text-slate-400 hover:text-emerald-400 transition"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-slate-400 text-xs">Balance</p>
            <p className="text-white font-bold text-lg">{stats.balance}</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <Award className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-slate-400 text-xs">Posts</p>
            <p className="text-white font-bold text-lg">{stats.posts}</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-slate-400 text-xs">Votes</p>
            <p className="text-white font-bold text-lg">{stats.votes}</p>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <p className="text-xs font-semibold text-slate-300 uppercase mb-3">Your Benefits</p>
          <div className="grid grid-cols-2 gap-2">
            {getTierBenefits(userTier).map((benefit) => (
              <div key={benefit} className="bg-slate-900 rounded p-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1 inline mr-2" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
