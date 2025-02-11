"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, GripVertical, X } from "lucide-react"

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([
    { id: 1, time: "09:00", activity: "Morning Meditation", duration: 15 },
    { id: 2, time: "09:30", activity: "Check Emails", duration: 30 },
    { id: 3, time: "10:30", activity: "Deep Work Session", duration: 60 },
  ])

  const [draggedItem, setDraggedItem] = useState(null)
  const [newActivity, setNewActivity] = useState("")
  const [newDuration, setNewDuration] = useState("15")

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.currentTarget.classList.add('opacity-50')
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    const draggingOver = Number(e.currentTarget.dataset.index)
    if (draggedItem && draggingOver !== draggedItem.id) {
      const items = [...routines]
      const draggedItemIndex = items.findIndex(item => item.id === draggedItem.id)
      const draggingOverIndex = items.findIndex(item => item.id === draggingOver)
      
      items.splice(draggedItemIndex, 1)
      items.splice(draggingOverIndex, 0, draggedItem)
      
      setRoutines(items)
    }
  }

  const addRoutine = () => {
    if (!newActivity.trim()) return
    const lastRoutine = routines[routines.length - 1]
    const lastTime = lastRoutine ? lastRoutine.time : "09:00"
    
    const [hours, minutes] = lastTime.split(":").map(Number)
    const newMinutes = minutes + Number(newDuration)
    const newHours = hours + Math.floor(newMinutes / 60)
    const finalMinutes = newMinutes % 60
    
    const newTime = `${String(newHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`
    
    setRoutines([
      ...routines,
      {
        id: Date.now(),
        time: newTime,
        activity: newActivity,
        duration: Number(newDuration),
      },
    ])
    setNewActivity("")
  }

  const removeRoutine = (id) => {
    setRoutines(routines.filter(routine => routine.id !== id))
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto p-4">
        <Card className="material-elevation-2 p-6">
          <h1 className="text-3xl font-display mb-6 text-foreground">Daily Routine</h1>

          {/* Add Routine Input */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a new activity..."
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addRoutine()}
              className="flex-1 bg-surface-container-low border-outline"
            />
            <Select
              value={newDuration}
              onValueChange={setNewDuration}
            >
              <SelectTrigger className="w-[180px] bg-surface-container-low border-outline">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent className="bg-surface-container-high border-outline">
                {[15, 30, 45, 60, 90, 120].map((mins) => (
                  <SelectItem key={mins} value={String(mins)}>
                    {mins} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={addRoutine}
              className="bg-primary-container text-primary state-layer-hover state-layer-active"
            >
              <PlusCircle className="w-5 h-5 mr-1" /> Add
            </Button>
          </div>

          {/* Routines List */}
          <div className="space-y-3">
            {routines.map((routine, index) => (
              <Card
                key={routine.id}
                draggable
                onDragStart={(e) => handleDragStart(e, routine)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                data-index={routine.id}
                className="material-elevation-1 p-4 state-layer-hover cursor-move"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-foreground/40" />
                  <div className="w-20 font-display text-primary">
                    {routine.time}
                  </div>
                  <div className="flex-1">{routine.activity}</div>
                  <div className="text-foreground/60">
                    {routine.duration} min
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRoutine(routine.id)}
                    className="text-error state-layer-hover"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}