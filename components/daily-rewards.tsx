"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Calendar, Clock } from 'lucide-react'
import { 
  canClaimDailyReward, 
  getTimeUntilNextReward, 
  DAILY_REWARD_AMOUNTS,
  getUserStats,
  saveUserStats,
  saveDailyReward
} from "@/lib/gamification-utils"

interface DailyRewardsProps {
  walletAddress: string
  userTier: "bronze" | "silver" | "gold" | null
}

export function DailyRewards({ walletAddress, userTier }: DailyRewardsProps) {
  const [canClaim, setCanClaim] = useState(false)
  const [timeUntilReward, setTimeUntilReward] = useState("Loading...")
  const [isClaiming, setIsClaiming] = useState(false)
  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    const stats = getUserStats(walletAddress)
    setUserStats(stats)
    
    const check = canClaimDailyReward(stats.dailyRewardLastClaimed)
    setCanClaim(check)
    
    const time = getTimeUntilNextReward(stats.dailyRewardLastClaimed)
    setTimeUntilReward(time)

    // Update countdown every minute
    const interval = setInterval(() => {
      const newTime = getTimeUntilNextReward(stats.dailyRewardLastClaimed)
      setTimeUntilReward(newTime)
      setCanClaim(canClaimDailyReward(stats.dailyRewardLastClaimed))
    }, 60000)

    return () => clearInterval(interval)
  }, [walletAddress])

  const handleClaimReward = async () => {
    if (!canClaim || !userTier || !userStats) return

    setIsClaiming(true)

    try {
      const rewardAmount = DAILY_REWARD_AMOUNTS[userTier]
      
      const reward = {
        id: `reward_${Date.now()}`,
        walletAddress,
        amount: rewardAmount,
        type: "daily",
        claimedAt: new Date(),
        tier: userTier,
      }

      saveDailyReward(reward)

      const updatedStats = {
        ...userStats,
        dailyRewardLastClaimed: new Date(),
        totalRewardsClaimed: (userStats.totalRewardsClaimed || 0) + rewardAmount,
        score: (userStats.score || 0) + (rewardAmount * 2), // Bonus points
      }

      saveUserStats(updatedStats)
      setUserStats(updatedStats)
      setCanClaim(false)
      setTimeUntilReward(getTimeUntilNextReward(new Date()))
    } catch (error) {
      console.error("[ChonkPump] Error claiming reward:", error)
    } finally {
      setIsClaiming(false)
    }
  }

  const rewardAmount = userTier ? DAILY_REWARD_AMOUNTS[userTier] : 0

  return (
    <Card className="border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-cyan-400" />
          Daily Rewards
        </CardTitle>
        <CardDescription>Claim your daily bonus to boost your score</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-900 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Today's Reward</span>
            <Badge className="bg-cyan-600 text-cyan-100">+{rewardAmount} Points</Badge>
          </div>
          
          <div className="text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Total Claimed: {userStats?.totalRewardsClaimed || 0} points</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{timeUntilReward}</span>
          </div>
        </div>

        <Button
          onClick={handleClaimReward}
          disabled={!canClaim || isClaiming}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500"
        >
          {isClaiming ? "Claiming..." : canClaim ? "Claim Daily Reward" : "Return Tomorrow"}
        </Button>

        <div className="text-xs text-slate-500 text-center space-y-1">
          <p>Rewards vary by tier</p>
          <div className="flex justify-around text-xs">
            <span>Bronze: 10 pts</span>
            <span>Silver: 25 pts</span>
            <span>Gold: 50 pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
