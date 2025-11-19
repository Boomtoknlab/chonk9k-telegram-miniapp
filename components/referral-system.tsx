"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Share2, Copy, Check } from 'lucide-react'
import {
  generateReferralCode,
  getUserStats,
  getReferralsForWallet,
  saveUserStats,
  saveReferral,
  REFERRAL_REWARD_AMOUNTS
} from "@/lib/gamification-utils"

interface ReferralSystemProps {
  walletAddress: string
  userTier: "bronze" | "silver" | "gold" | null
}

export function ReferralSystem({ walletAddress, userTier }: ReferralSystemProps) {
  const [userStats, setUserStats] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [referralCode, setReferralCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [inputCode, setInputCode] = useState("")
  const [applyMessage, setApplyMessage] = useState("")

  useEffect(() => {
    const stats = getUserStats(walletAddress)
    if (!stats.referralCode) {
      stats.referralCode = generateReferralCode(walletAddress)
      saveUserStats(stats)
    }
    setUserStats(stats)
    setReferralCode(stats.referralCode)

    const userReferrals = getReferralsForWallet(walletAddress)
    setReferrals(userReferrals)
  }, [walletAddress])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApplyReferral = () => {
    if (!inputCode.trim()) {
      setApplyMessage("Please enter a referral code")
      return
    }

    if (inputCode === referralCode) {
      setApplyMessage("Cannot apply your own referral code")
      return
    }

    try {
      const stats = getUserStats(walletAddress)
      
      if (stats.referredBy) {
        setApplyMessage("You already have a referral")
        return
      }

      const newReferral = {
        id: `referral_${Date.now()}`,
        referrerAddress: inputCode, // In production, extract from code
        referredAddress: walletAddress,
        referralCode: inputCode,
        createdAt: new Date(),
        reward: userTier ? REFERRAL_REWARD_AMOUNTS[userTier] : 0,
        claimed: false,
      }

      saveReferral(newReferral)

      stats.referredBy = inputCode
      stats.score = (stats.score || 0) + (newReferral.reward * 2)
      saveUserStats(stats)
      setUserStats(stats)

      setApplyMessage("Referral applied! Rewards will be distributed.")
      setInputCode("")
    } catch (error) {
      console.error("[ChonkPump] Error applying referral:", error)
      setApplyMessage("Error applying referral")
    }
  }

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${referralCode}`
  const earnedRewards = referrals.reduce((sum, r) => sum + (r.reward || 0), 0)

  return (
    <div className="space-y-4">
      {/* Your Referral Code */}
      <Card className="border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            Your Referral Code
          </CardTitle>
          <CardDescription>Share your code to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between">
            <code className="text-purple-400 font-mono font-semibold">{referralCode}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-slate-400 space-y-2">
            <p>Share this code with friends to earn rewards:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>Bronze: +{REFERRAL_REWARD_AMOUNTS.bronze} pts</div>
              <div>Silver: +{REFERRAL_REWARD_AMOUNTS.silver} pts</div>
              <div>Gold: +{REFERRAL_REWARD_AMOUNTS.gold} pts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Enter Referral Code
          </CardTitle>
          <CardDescription>Apply a code to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter referral code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="bg-slate-900 border-slate-700"
            />
            <Button
              onClick={handleApplyReferral}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Apply
            </Button>
          </div>
          {applyMessage && (
            <p className="text-sm text-slate-400">{applyMessage}</p>
          )}
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg p-3">
              <p className="text-slate-400 text-sm">Total Referrals</p>
              <p className="text-2xl font-bold text-emerald-400">{referrals.length}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <p className="text-slate-400 text-sm">Earned Rewards</p>
              <p className="text-2xl font-bold text-purple-400">+{earnedRewards} pts</p>
            </div>
          </div>

          {referrals.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-300">Recent Referrals</p>
              {referrals.slice(-5).map((ref) => (
                <div key={ref.id} className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded">
                  <span className="text-slate-400 font-mono">{ref.referredAddress.slice(0, 8)}...</span>
                  <Badge className="bg-purple-600 text-purple-100">+{ref.reward} pts</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
