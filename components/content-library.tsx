"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, FileText, Video, BookOpen, Download, Eye, Star } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface ContentLibraryProps {
  userTier: "bronze" | "silver" | "gold"
}

interface ContentItem {
  id: number
  title: string
  description: string
  type: "guide" | "video" | "document" | "course"
  tier: "bronze" | "silver" | "gold"
  category: string
  views: number
  rating: number
  duration?: string
  author: string
  releaseDate: string
  featured?: boolean
}

export function ContentLibrary({ userTier }: ContentLibraryProps) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  const content: ContentItem[] = [
    {
      id: 1,
      title: "Getting Started Guide",
      description: "Learn the basics of the ChonkPump ecosystem. Perfect for new community members.",
      type: "guide",
      tier: "bronze",
      category: "Beginner",
      views: 2340,
      rating: 4.8,
      author: "Community Team",
      releaseDate: "Oct 2024",
      featured: true,
    },
    {
      id: 2,
      title: "Token Strategy Webinar",
      description: "Advanced strategies from community leaders on optimizing your token holdings.",
      type: "video",
      tier: "silver",
      category: "Strategy",
      views: 1205,
      rating: 4.6,
      duration: "1h 24m",
      author: "Expert Panel",
      releaseDate: "Nov 2024",
    },
    {
      id: 3,
      title: "Whitepaper V2 Analysis",
      description: "Deep dive into the upcoming tokenomics update with comprehensive analysis.",
      type: "document",
      tier: "gold",
      category: "Technical",
      views: 456,
      rating: 4.9,
      author: "Dev Team",
      releaseDate: "Nov 2024",
    },
    {
      id: 4,
      title: "Community Trading Tips",
      description: "Practical tips for trading and managing your portfolio effectively.",
      type: "guide",
      tier: "bronze",
      category: "Trading",
      views: 1876,
      rating: 4.5,
      author: "Trading Experts",
      releaseDate: "Sep 2024",
    },
    {
      id: 5,
      title: "Advanced DeFi Strategies",
      description: "Master complex DeFi strategies and yield optimization techniques.",
      type: "course",
      tier: "silver",
      category: "Advanced",
      views: 892,
      rating: 4.7,
      duration: "3h 15m",
      author: "Finance Advisor",
      releaseDate: "Oct 2024",
    },
    {
      id: 6,
      title: "Exclusive Governance Guide",
      description: "Complete guide to participating in governance votes and shaping the future.",
      type: "document",
      tier: "gold",
      category: "Governance",
      views: 234,
      rating: 4.8,
      author: "Governance Team",
      releaseDate: "Nov 2024",
    },
  ]

  const canAccess = (contentTier: string) => {
    const tierHierarchy = { bronze: 1, silver: 2, gold: 3 }
    return tierHierarchy[userTier as keyof typeof tierHierarchy] >= tierHierarchy[contentTier as keyof typeof tierHierarchy]
  }

  const toggleFavorite = (id: number) => {
    if (favoriteIds.includes(id)) {
      setFavoriteIds(favoriteIds.filter(fid => fid !== id))
    } else {
      setFavoriteIds([...favoriteIds, id])
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />
      case "document":
        return <FileText className="w-5 h-5" />
      case "course":
        return <BookOpen className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Beginner": "bg-blue-500/20 text-blue-300",
      "Strategy": "bg-purple-500/20 text-purple-300",
      "Technical": "bg-orange-500/20 text-orange-300",
      "Trading": "bg-green-500/20 text-green-300",
      "Advanced": "bg-red-500/20 text-red-300",
      "Governance": "bg-yellow-500/20 text-yellow-300",
    }
    return colors[category] || "bg-slate-500/20 text-slate-300"
  }

  const featuredContent = content.find(c => c.featured && canAccess(c.tier))

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-white font-bold text-xl">Content Library</h2>

      {/* Featured Content */}
      {featuredContent && (
        <Card className="bg-gradient-to-r from-emerald-900/30 to-slate-800 border-emerald-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-emerald-500">
                  {getIcon(featuredContent.type)}
                </div>
                <div>
                  <Badge className="mb-2 bg-emerald-500 text-white">Featured</Badge>
                  <CardTitle className="text-white text-lg">{featuredContent.title}</CardTitle>
                </div>
              </div>
              <Star className="w-5 h-5 text-emerald-500 fill-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300 mb-4">{featuredContent.description}</CardDescription>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Start Reading
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => {
          const canAccessItem = canAccess(item.tier)
          const isFavorite = favoriteIds.includes(item.id)

          return (
            <Card
              key={item.id}
              className={`border-slate-700 transition ${
                canAccessItem ? "bg-slate-800 hover:bg-slate-750" : "bg-slate-900 opacity-60"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-emerald-500">
                    {getIcon(item.type)}
                  </div>
                  {canAccessItem && (
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="text-slate-400 hover:text-yellow-400 transition"
                    >
                      <Star
                        className="w-5 h-5"
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-white text-base">{item.title}</CardTitle>
                  <Badge className={getCategoryColor(item.category)} variant="outline">
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <CardDescription className="text-slate-400 text-sm">
                  {item.description}
                </CardDescription>

                {/* Metadata */}
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>By {item.author}</span>
                    <span>{item.releaseDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  {item.duration && (
                    <div>Duration: {item.duration}</div>
                  )}
                </div>

                {/* Tier Badge */}
                <Badge className="w-full text-center justify-center bg-slate-700 text-slate-300">
                  {item.tier.toUpperCase()} Tier
                </Badge>

                {/* Access Button */}
                {canAccessItem ? (
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Access Content
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Upgrade to {item.tier.toUpperCase()}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
