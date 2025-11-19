"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, MapPin, Check, AlertCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface EventCalendarProps {
  userTier: "bronze" | "silver" | "gold"
}

interface CalendarEvent {
  id: number
  title: string
  date: string
  time: string
  timezone: string
  tier: "bronze" | "silver" | "gold"
  attendees: number
  maxAttendees: number
  category: string
  description: string
  speakers?: string[]
  location?: string
}

export function EventCalendar({ userTier }: EventCalendarProps) {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])

  const events: CalendarEvent[] = [
    {
      id: 1,
      title: "Weekly Community Chat",
      date: "Nov 20, 2024",
      time: "6:00 PM",
      timezone: "UTC",
      tier: "bronze",
      attendees: 234,
      maxAttendees: 500,
      category: "Community",
      description: "Join our weekly community call to discuss current initiatives and connect with members.",
      location: "Discord Voice",
    },
    {
      id: 2,
      title: "Silver Tier AMA with Devs",
      date: "Nov 22, 2024",
      time: "7:00 PM",
      timezone: "UTC",
      tier: "silver",
      attendees: 89,
      maxAttendees: 200,
      category: "AMA",
      description: "Exclusive Q&A session with the development team. Ask anything about the project roadmap and future plans.",
      speakers: ["Dev Lead", "Product Manager", "Community Manager"],
      location: "Zoom Webinar",
    },
    {
      id: 3,
      title: "VIP Gold Member Dinner",
      date: "Nov 25, 2024",
      time: "8:00 PM",
      timezone: "UTC",
      tier: "gold",
      attendees: 23,
      maxAttendees: 50,
      category: "Networking",
      description: "Exclusive networking dinner for our most valued community members. Premium dining experience.",
      speakers: ["CEO", "Founding Team"],
      location: "Premium Virtual Event",
    },
    {
      id: 4,
      title: "Token Mechanics Workshop",
      date: "Nov 27, 2024",
      time: "5:00 PM",
      timezone: "UTC",
      tier: "bronze",
      attendees: 156,
      maxAttendees: 300,
      category: "Educational",
      description: "Learn how token mechanics work and explore strategies for optimizing your portfolio.",
      speakers: ["Economics Expert"],
      location: "Discord",
    },
  ]

  const canAccess = (eventTier: string) => {
    const tierHierarchy = { bronze: 1, silver: 2, gold: 3 }
    return tierHierarchy[userTier as keyof typeof tierHierarchy] >= tierHierarchy[eventTier as keyof typeof tierHierarchy]
  }

  const isRegistered = (eventId: number) => registeredEvents.includes(eventId)

  const handleRegister = (eventId: number) => {
    if (isRegistered(eventId)) {
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId))
    } else {
      setRegisteredEvents([...registeredEvents, eventId])
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-xl">Upcoming Events</h2>
        <div className="text-sm text-slate-400">
          You've registered for {registeredEvents.length} event{registeredEvents.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {events.map((event) => {
          const canAccessEvent = canAccess(event.tier)
          const registered = isRegistered(event.id)
          const isFull = event.attendees >= event.maxAttendees

          return (
            <Card
              key={event.id}
              className={`border-slate-700 transition ${
                canAccessEvent ? "bg-slate-800" : "bg-slate-900 opacity-60"
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                    <Badge className="mt-2" variant="outline">
                      {event.category}
                    </Badge>
                  </div>
                  <Badge className={getTierColor(event.tier)}>
                    {event.tier.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{event.time} {event.timezone}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-3 text-slate-300">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>
                      {event.attendees}/{event.maxAttendees} attending
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm">{event.description}</p>

                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-300 mb-2">Speakers:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.speakers.map((speaker) => (
                        <span key={speaker} className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded">
                          {speaker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attendance Status */}
                {isFull && (
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded p-2 text-xs text-yellow-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Event is at capacity
                  </div>
                )}

                {/* Register Button */}
                {canAccessEvent ? (
                  <Button
                    onClick={() => handleRegister(event.id)}
                    disabled={isFull && !registered}
                    className={
                      registered
                        ? "w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "w-full bg-slate-700 hover:bg-slate-600 text-white"
                    }
                  >
                    {registered ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Registered
                      </>
                    ) : isFull ? (
                      "Event Full"
                    ) : (
                      "Register Now"
                    )}
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full">
                    Requires {event.tier.toUpperCase()} tier
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
