"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/components/user-profile"
import { ForumSection } from "@/components/forum-section"
import { EventCalendar } from "@/components/event-calendar"
import { ContentLibrary } from "@/components/content-library"
import { Leaderboard } from "@/components/leaderboard"
import { DailyRewards } from "@/components/daily-rewards"
import { ReferralSystem } from "@/components/referral-system"
import { LogOut, Home, MessageSquare, Calendar, Library, Users, RefreshCw, Bell, Settings, Trophy, Gift, Share2 } from 'lucide-react'
import { getTokenBalance, formatTokenAmount } from "@/lib/solana-utils"
import { getUserStats, calculateUserScore } from "@/lib/gamification-utils"

interface DashboardProps {
  walletAddress: string
  userTier: "bronze" | "silver" | "gold"
}

export function Dashboard({ walletAddress, userTier }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [userScore, setUserScore] = useState(0)
  const [referralCount, setReferralCount] = useState(0)

  const communityStats = {
    totalMembers: 5234,
    activeToday: 892,
    totalPosts: 12456,
  }

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getTokenBalance(walletAddress)
      setTokenBalance(balance)
    }
    fetchBalance()
    
    const stats = getUserStats(walletAddress)
    const score = calculateUserScore(userTier, stats.posts || 0, stats.votes || 0, stats.totalReferrals || 0)
    setUserScore(score)
    setReferralCount(stats.totalReferrals || 0)
  }, [walletAddress, userTier])

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    const balance = await getTokenBalance(walletAddress)
    setTokenBalance(balance)
    
    const stats = getUserStats(walletAddress)
    const score = calculateUserScore(userTier, stats.posts || 0, stats.votes || 0, stats.totalReferrals || 0)
    setUserScore(score)
    setReferralCount(stats.totalReferrals || 0)
    
    setIsRefreshing(false)
  }

  const handleDisconnect = () => {
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("userTier")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/chonkpump-logo.png" 
              alt="ChonkPump" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-white font-bold">ChonkPump Community</h1>
              <p className="text-xs text-slate-400">Token-Gated Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-slate-400 hover:text-slate-200"
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-slate-200"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-slate-400">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Profile Card */}
        <UserProfile walletAddress={walletAddress} userTier={userTier} tokenBalance={tokenBalance} />

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Members</p>
                  <p className="text-white font-bold text-2xl">{communityStats.totalMembers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-emerald-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Now</p>
                  <p className="text-white font-bold text-2xl">{communityStats.activeToday}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Your Score</p>
                  <p className="text-white font-bold text-2xl">{userScore.toLocaleString()}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Your Referrals</p>
                  <p className="text-white font-bold text-2xl">{referralCount}</p>
                </div>
                <Share2 className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800">
            <TabsTrigger value="home" className="text-slate-400 data-[state=active]:text-white">
              <Home className="w-4 h-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="forum" className="text-slate-400 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Forum
            </TabsTrigger>
            <TabsTrigger value="events" className="text-slate-400 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="content" className="text-slate-400 data-[state=active]:text-white">
              <Library className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-slate-400 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-slate-400 data-[state=active]:text-white">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-slate-400 data-[state=active]:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Welcome to ChonkPump Community</CardTitle>
                <CardDescription>Your tier: {userTier.toUpperCase()} • Balance: {tokenBalance ? formatTokenAmount(tokenBalance) : 'Loading...'} CHONK • Score: {userScore.toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">Connect with fellow token holders, participate in discussions, and unlock exclusive content based on your tier. Earn rewards, climb the leaderboard, and grow your referral network!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forum">
            <ForumSection userTier={userTier} />
          </TabsContent>

          <TabsContent value="events">
            <EventCalendar userTier={userTier} />
          </TabsContent>

          <TabsContent value="content">
            <ContentLibrary userTier={userTier} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Leaderboard userWalletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <DailyRewards walletAddress={walletAddress} userTier={userTier} />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-4">
            <ReferralSystem walletAddress={walletAddress} userTier={userTier} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
