import { PublicKey, Connection, Cluster } from "@solana/web3.js"
import { getAssociatedTokenAddress, getMint, getAccount } from "@solana/spl-token"

// ChonkPump 9000 token on Solana mainnet
// Real contract: DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump
export const CHONK_TOKEN_MINT = new PublicKey("DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump")

// Production Solana RPC endpoint
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
const NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta") as Cluster

export const connection = new Connection(RPC_ENDPOINT, "confirmed")

// Tier thresholds
export const TIER_THRESHOLDS = {
  bronze: 100,
  silver: 500,
  gold: 1000,
}

export type TokenTier = "bronze" | "silver" | "gold" | null

export async function getTokenBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress)
    const tokenAccount = await getAssociatedTokenAddress(CHONK_TOKEN_MINT, publicKey)
    
    const accountInfo = await getAccount(connection, tokenAccount)
    const mintInfo = await getMint(connection, CHONK_TOKEN_MINT)
    const balance = Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals)
    
    return balance
  } catch (error) {
    console.error("[ChonkPump] Error fetching token balance:", error)
    return 0
  }
}

export function determineTier(balance: number): TokenTier {
  if (balance >= TIER_THRESHOLDS.gold) {
    return "gold"
  } else if (balance >= TIER_THRESHOLDS.silver) {
    return "silver"
  } else if (balance >= TIER_THRESHOLDS.bronze) {
    return "bronze"
  }
  return null
}

export function getTierBenefits(tier: TokenTier) {
  switch (tier) {
    case "gold":
      return {
        canAccess: ["forums", "chat", "events", "content", "voting"],
        description: "Full access to all community features including governance voting and VIP events",
        benefits: ["Forums & Chat", "Exclusive Content", "Weekly AMAs", "Governance Voting", "VIP Events"]
      }
    case "silver":
      return {
        canAccess: ["forums", "chat", "events", "content"],
        description: "Access to exclusive content and weekly AMAs",
        benefits: ["Forums & Chat", "Exclusive Content", "Weekly AMAs"]
      }
    case "bronze":
      return {
        canAccess: ["forums", "chat"],
        description: "Access to basic community forums and chat",
        benefits: ["Community Forums", "General Chat"]
      }
    default:
      return {
        canAccess: [],
        description: "Hold 100+ CHONK tokens to join the community",
        benefits: []
      }
  }
}

export function formatTokenAmount(amount: number): string {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function getTokenExplorerUrl(address: string): string {
  return `https://solscan.io/account/${address}?cluster=mainnet`
}
