"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, ThumbsUp, Reply, Plus, Search, TrendingUp } from 'lucide-react'

interface ForumSectionProps {
  userTier: "bronze" | "silver" | "gold"
}

interface ForumThread {
  id: number
  author: string
  authorTier: "bronze" | "silver" | "gold"
  title: string
  content: string
  category: string
  requiredTier: "bronze" | "silver" | "gold"
  replies: number
  likes: number
  views: number
  lastActivity: string
  isPinned?: boolean
}

export function ForumSection({ userTier }: ForumSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const threads: ForumThread[] = [
    {
      id: 1,
      author: "TokenHolder1",
      authorTier: "bronze",
      title: "Upcoming Token Utility Announcement",
      content: "What are everyone's expectations for the new utilities? Share your thoughts...",
      category: "General Discussion",
      requiredTier: "bronze",
      replies: 24,
      likes: 156,
      views: 1243,
      lastActivity: "2 hours ago",
      isPinned: true,
    },
    {
      id: 2,
      author: "ChonkWhale",
      authorTier: "silver",
      title: "AMA with Dev Team - This Wednesday",
      content: "Join us for an exclusive AMA session with the core development team. Ask anything!",
      category: "Events & Announcements",
      requiredTier: "silver",
      replies: 12,
      likes: 89,
      views: 567,
      lastActivity: "4 hours ago",
    },
    {
      id: 3,
      author: "GoldMember",
      authorTier: "gold",
      title: "Governance Proposal: V2 Tokenomics",
      content: "Please review the attached proposal for V2 tokenomics and vote on implementation...",
      category: "Governance",
      requiredTier: "gold",
      replies: 8,
      likes: 234,
      views: 892,
      lastActivity: "1 hour ago",
    },
    {
      id: 4,
      author: "CommunityMod",
      authorTier: "gold",
      title: "Strategy: How to Maximize Your Holdings",
      content: "Discussion on portfolio strategies and token optimization techniques...",
      category: "Strategy & Tips",
      requiredTier: "silver",
      replies: 45,
      likes: 312,
      views: 2156,
      lastActivity: "30 minutes ago",
    },
  ]

  const categories = ["all", "General Discussion", "Events & Announcements", "Governance", "Strategy & Tips"]

  const canAccessThread = (requiredTier: string) => {
    const tierHierarchy = { bronze: 1, silver: 2, gold: 3 }
    return tierHierarchy[userTier as keyof typeof tierHierarchy] >= tierHierarchy[requiredTier as keyof typeof tierHierarchy]
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "gold":
        return "bg-yellow-500/20 text-yellow-300"
      case "silver":
        return "bg-slate-400/20 text-slate-200"
      case "bronze":
        return "bg-orange-500/20 text-orange-300"
      default:
        return "bg-slate-600/20"
    }
  }

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || thread.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-xl">Community Forum</h2>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "bg-emerald-500 text-white" : "border-slate-600 text-slate-400"}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Forum Threads */}
      <div className="space-y-3">
        {filteredThreads.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-400">No threads found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          filteredThreads.map((thread) => (
            <Card
              key={thread.id}
              className={`border-slate-700 cursor-pointer transition ${
                canAccessThread(thread.requiredTier)
                  ? "bg-slate-800 hover:bg-slate-750"
                  : "bg-slate-900 opacity-60"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Thread Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${getTierBadgeColor(thread.authorTier)}`}>
                        {thread.author}
                      </span>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                        {thread.category}
                      </span>
                      {thread.isPinned && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                          PINNED
                        </span>
                      )}
                    </div>

                    <h3 className="text-white font-semibold mb-2 text-lg">{thread.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{thread.content}</p>

                    {/* Thread Stats */}
                    <div className="flex items-center gap-6 text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{thread.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{thread.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{thread.views} views</span>
                      </div>
                      <span className="ml-auto">{thread.lastActivity}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {canAccessThread(thread.requiredTier) && (
                    <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400 flex-shrink-0">
                      <Reply className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Access Restriction Notice */}
                {!canAccessThread(thread.requiredTier) && (
                  <div className="mt-4 p-3 bg-slate-900 rounded text-xs text-slate-500">
                    Requires {thread.requiredTier.toUpperCase()} tier - Hold {
                      thread.requiredTier === "gold" ? "1000+" : thread.requiredTier === "silver" ? "500+" : "100+"
                    } CHONK tokens
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
