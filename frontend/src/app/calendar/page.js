"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  CalendarRange,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  AlertCircle,
} from "lucide-react"

const URGENCY_LEVELS = {
  low: { color: "text-jewel-emerald", bg: "bg-jewel-emerald/10" },
  medium: { color: "text-jewel-topaz", bg: "bg-jewel-topaz/10" },
  high: { color: "text-jewel-ruby", bg: "bg-jewel-ruby/10" },
  critical: { color: "text-error", bg: "bg-error/10" },
}

const ITEM_TYPES = {
  routine: { icon: Clock, color: "text-jewel-sapphire" },
  task: { icon: AlertCircle, color: "text-jewel-emerald" },
  event: { icon: CalendarIcon, color: "text-jewel-amethyst" },
  obligation: { icon: AlertCircle, color: "text-jewel-ruby" },
}

export default function CalendarPage() {
  const [view, setView] = useState("week")
  const [date, setDate] = useState(new Date())
  const [draggedItem, setDraggedItem] = useState(null)

  // Mock data for calendar items
  const [calendarItems] = useState([
    {
      id: 1,
      type: "routine",
      title: "Morning Routine",
      time: "09:00",
      duration: 60,
      urgency: "medium",
      pomodoroEnabled: true,
    },
    {
      id: 2,
      type: "task",
      title: "Project Planning",
      time: "10:30",
      duration: 90,
      urgency: "high",
      pomodoroEnabled: true,
    },
    {
      id: 3,
      type: "obligation",
      title: "Team Meeting",
      time: "14:00",
      duration: 45,
      urgency: "critical",
      pomodoroEnabled: false,
    },
  ])

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.currentTarget.classList.add('opacity-50')
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50')
    setDraggedItem(null)
  }

  const handleDrop = (e, timeSlot) => {
    e.preventDefault()
    if (draggedItem) {
      // Handle item dropping logic
      console.log('Dropped', draggedItem, 'at', timeSlot)
    }
  }

  const renderTimeSlots = () => {
    const slots = []
    for (let hour = 6; hour < 22; hour++) {
      slots.push(
        <div
          key={hour}
          className="h-20 border-t border-outline/20 relative group"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, `${hour}:00`)}
        >
          <span className="absolute -top-3 left-0 text-sm text-foreground/60">
            {`${hour}:00`}
          </span>
          <div className="absolute inset-0 group-hover:bg-primary/5 transition-colors" />
        </div>
      )
    }
    return slots
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <Card className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display">Calendar</h1>
          <div className="flex gap-2">
            <Button className="bg-primary-container text-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <Tabs value={view} onValueChange={setView} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-surface-container">
              <TabsTrigger value="day">
                <CalendarDays className="w-4 h-4 mr-2" />
                Day
              </TabsTrigger>
              <TabsTrigger value="week">
                <CalendarRange className="w-4 h-4 mr-2" />
                Week
              </TabsTrigger>
              <TabsTrigger value="month">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Month
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </div>

          <TabsContent value="day" className="mt-4">
            <div className="space-y-1">
              {renderTimeSlots()}
            </div>
          </TabsContent>

          <TabsContent value="week" className="mt-4">
            <div className="grid grid-cols-7 gap-4">
              {/* Week view implementation */}
            </div>
          </TabsContent>

          <TabsContent value="month" className="mt-4">
            <div className="grid grid-cols-7 gap-4">
              {/* Month view implementation */}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}