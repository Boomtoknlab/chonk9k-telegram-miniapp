// Production types for community hub
export type UserTier = "bronze" | "silver" | "gold" | null

export interface UserProfile {
  walletAddress: string
  tier: UserTier
  tokenBalance: number
  joinedAt: Date
  posts: number
  votes: number
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  authorTier: UserTier
  createdAt: Date
  replies: number
  views: number
  likes: number
  isPinned: boolean
  category: string
  requiredTier?: UserTier
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  speakers: string[]
  capacity: number
  registered: number
  requiredTier?: UserTier
  image?: string
}

export interface ContentItem {
  id: string
  title: string
  description: string
  type: "guide" | "video" | "course" | "document"
  author: string
  createdAt: Date
  views: number
  rating: number
  requiredTier?: UserTier
  url?: string
}

export interface UserStats {
  walletAddress: string
  tier: UserTier
  tokenBalance: number
  joinedAt: Date
  posts: number
  votes: number
  score: number
  referralCode: string
  referredBy?: string
  totalReferrals: number
  dailyRewardLastClaimed: Date | null
  totalRewardsClaimed: number
}

export interface LeaderboardEntry {
  rank: number
  walletAddress: string
  score: number
  tier: UserTier
  referralCount: number
  posts: number
  displayName: string
}

export interface DailyReward {
  id: string
  walletAddress: string
  amount: number
  type: "daily" | "referral" | "activity"
  claimedAt: Date
  tier: UserTier
}

export interface ReferralRecord {
  id: string
  referrerAddress: string
  referredAddress: string
  referralCode: string
  createdAt: Date
  reward: number
  claimed: boolean
}
