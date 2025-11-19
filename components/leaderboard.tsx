"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Zap } from 'lucide-react'
import { getLeaderboardEntries } from "@/lib/gamification-utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LeaderboardProps {
  userWalletAddress?: string
}

export function Leaderboard({ userWalletAddress }: LeaderboardProps) {
  const [entries, setEntries] = useState<any[]>([])
  const [userRank, setUserRank] = useState<any>(null)

  useEffect(() => {
    const leaderboard = getLeaderboardEntries()
    setEntries(leaderboard)
    
    if (userWalletAddress) {
      const rank = leaderboard.find(e => e.walletAddress === userWalletAddress)
      setUserRank(rank)
    }
  }, [userWalletAddress])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "gold":
        return "bg-yellow-900 text-yellow-200"
      case "silver":
        return "bg-slate-600 text-slate-100"
      case "bronze":
        return "bg-orange-900 text-orange-200"
      default:
        return "bg-slate-700 text-slate-300"
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />
    if (rank === 3) return <Medal className="w-4 h-4 text-orange-600" />
    return null
  }

  return (
    <div className="space-y-4">
      {/* User Rank Card */}
      {userRank && (
        <Card className="border-emerald-500 bg-gradient-to-r from-emerald-900 to-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-emerald-400">#{userRank.rank}</div>
                <div>
                  <p className="text-white font-semibold">Your Rank</p>
                  <p className="text-emerald-300 text-sm">{userRank.score} points</p>
                </div>
              </div>
              <Badge className={getTierColor(userRank.tier)}>{userRank.tier.toUpperCase()}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Performers
          </CardTitle>
          <CardDescription>Ranked by community score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Posts</TableHead>
                  <TableHead className="text-right">Referrals</TableHead>
                  <TableHead>Tier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.slice(0, 20).map((entry) => (
                  <TableRow key={entry.walletAddress} className={entry.walletAddress === userWalletAddress ? "bg-slate-800" : ""}>
                    <TableCell className="font-bold text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getRankIcon(entry.rank)}
                        {entry.rank}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{entry.displayName}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-400">
                      {entry.score}
                    </TableCell>
                    <TableCell className="text-right">{entry.posts}</TableCell>
                    <TableCell className="text-right flex justify-end gap-1">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      {entry.referralCount}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierColor(entry.tier)}>{entry.tier.toUpperCase()}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
