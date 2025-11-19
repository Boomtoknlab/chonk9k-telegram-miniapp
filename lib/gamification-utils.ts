// Gamification utilities for leaderboards, rewards, and referrals

export const DAILY_REWARD_AMOUNTS = {
  bronze: 10,
  silver: 25,
  gold: 50,
}

export const REFERRAL_REWARD_AMOUNTS = {
  bronze: 5,
  silver: 15,
  gold: 30,
}

// Generate unique referral code for user
export function generateReferralCode(walletAddress: string): string {
  const hash = walletAddress.slice(-6).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CHONK-${hash}-${randomPart}`
}

// Validate referral code format
export function isValidReferralCode(code: string): boolean {
  return /^CHONK-[A-Z0-9]{6}-[A-Z0-9]{6}$/.test(code)
}

// Calculate user score based on activity
export function calculateUserScore(
  tier: "bronze" | "silver" | "gold" | null,
  posts: number,
  votes: number,
  referrals: number
): number {
  const tierMultiplier = { bronze: 1, silver: 1.5, gold: 2, null: 0 }[tier] || 0
  const postScore = posts * 10
  const voteScore = votes * 5
  const referralScore = referrals * 50
  
  return Math.floor((postScore + voteScore + referralScore) * tierMultiplier)
}

// Check if user can claim daily reward
export function canClaimDailyReward(lastClaimedAt: Date | null): boolean {
  if (!lastClaimedAt) return true
  
  const now = new Date()
  const lastClaimed = new Date(lastClaimedAt)
  const daysSinceLastClaim = Math.floor((now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60 * 24))
  
  return daysSinceLastClaim >= 1
}

// Get time until next daily reward claim
export function getTimeUntilNextReward(lastClaimedAt: Date | null): string {
  if (!lastClaimedAt) return "Ready to claim"
  
  const now = new Date()
  const lastClaimed = new Date(lastClaimedAt)
  const nextClaim = new Date(lastClaimed.getTime() + 24 * 60 * 60 * 1000)
  
  if (now >= nextClaim) return "Ready to claim"
  
  const diff = nextClaim.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

// Store user data in localStorage with fallback structure
export function getUserStats(walletAddress: string): any {
  const stored = localStorage.getItem(`chonk_user_stats_${walletAddress}`)
  if (stored) return JSON.parse(stored)
  
  return {
    walletAddress,
    tier: null,
    tokenBalance: 0,
    joinedAt: new Date(),
    posts: 0,
    votes: 0,
    score: 0,
    referralCode: generateReferralCode(walletAddress),
    referredBy: null,
    totalReferrals: 0,
    dailyRewardLastClaimed: null,
    totalRewardsClaimed: 0,
  }
}

// Save user stats to localStorage
export function saveUserStats(stats: any): void {
  localStorage.setItem(`chonk_user_stats_${stats.walletAddress}`, JSON.stringify(stats))
}

// Store referral in localStorage
export function saveReferral(referralRecord: any): void {
  const referrals = JSON.parse(localStorage.getItem('chonk_referrals') || '[]')
  referrals.push(referralRecord)
  localStorage.setItem('chonk_referrals', JSON.stringify(referrals))
}

// Get all referrals for a wallet
export function getReferralsForWallet(walletAddress: string): any[] {
  const referrals = JSON.parse(localStorage.getItem('chonk_referrals') || '[]')
  return referrals.filter((r: any) => r.referrerAddress === walletAddress)
}

// Store daily rewards in localStorage
export function saveDailyReward(reward: any): void {
  const rewards = JSON.parse(localStorage.getItem('chonk_daily_rewards') || '[]')
  rewards.push(reward)
  localStorage.setItem('chonk_daily_rewards', JSON.stringify(rewards))
}

// Get all leaderboard entries
export function getLeaderboardEntries(): any[] {
  const leaderboard: any[] = []
  
  // Get all users from localStorage (would be database in production)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('chonk_user_stats_')) {
      const stats = JSON.parse(localStorage.getItem(key) || '{}')
      leaderboard.push({
        rank: 0,
        walletAddress: stats.walletAddress,
        score: stats.score,
        tier: stats.tier,
        referralCount: stats.totalReferrals,
        posts: stats.posts,
        displayName: `${stats.walletAddress.slice(0, 4)}...${stats.walletAddress.slice(-4)}`,
      })
    }
  }
  
  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score)
  
  // Add ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1
  })
  
  return leaderboard.slice(0, 100) // Top 100
}
