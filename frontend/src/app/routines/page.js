"use client"

import { useState, useRef } from "react"
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
import { useToast } from "@/hooks/use-toast"
import {
  PlusCircle,
  GripVertical,
  X,
  Save,
  LayoutTemplate,
} from "lucide-react"

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([
    { id: 1, time: "09:00", activity: "Morning Meditation", duration: 15 },
    { id: 2, time: "09:30", activity: "Check Emails", duration: 30 },
    { id: 3, time: "10:30", activity: "Deep Work Session", duration: 60 },
  ])
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const timeoutRef = useRef(null)
  const { toast } = useToast()

  const handleDragStart = (e, routine) => {
    setDraggedItem(routine)
    e.currentTarget.classList.add('opacity-50', 'scale-105')
    // Set custom drag image
    const dragImage = e.currentTarget.cloneNode(true)
    dragImage.classList.add('drag-ghost')
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    setTimeout(() => document.body.removeChild(dragImage), 0)
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50', 'scale-105')
    setDragOverIndex(null)
    setDraggedItem(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItem && dragOverIndex !== index) {
      setDragOverIndex(index)
      
      // Debounce the reordering
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        const newRoutines = [...routines]
        const draggedIndex = routines.findIndex(r => r.id === draggedItem.id)
        newRoutines.splice(draggedIndex, 1)
        newRoutines.splice(index, 0, draggedItem)
        
        // Recalculate times
        newRoutines.forEach((routine, i) => {
          if (i === 0) {
            routine.time = "09:00"
          } else {
            const prevRoutine = newRoutines[i - 1]
            const [prevHours, prevMinutes] = prevRoutine.time.split(":").map(Number)
            const newMinutes = prevMinutes + prevRoutine.duration
            const newHours = prevHours + Math.floor(newMinutes / 60)
            routine.time = `${String(newHours).padStart(2, '0')}:${String(newMinutes % 60).padStart(2, '0')}`
          }
        })
        
        setRoutines(newRoutines)
      }, 200)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display">Daily Routine</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-outline state-layer-hover"
            >
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button 
              className="bg-primary-container text-primary state-layer-hover"
              onClick={() => {
                toast({
                  title: "Routine Saved",
                  description: "Your routine has been saved successfully.",
                })
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Routines List */}
        <div className="space-y-3">
          {routines.map((routine, index) => (
            <Card
              key={routine.id}
              draggable
              onDragStart={(e) => handleDragStart(e, routine)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              className={`material-elevation-1 p-4 transition-all duration-200 cursor-move
                ${dragOverIndex === index ? 'translate-y-2 material-elevation-2' : ''}
                ${draggedItem?.id === routine.id ? 'opacity-50' : ''}
              `}
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
                  onClick={() => {
                    setRoutines(routines.filter(r => r.id !== routine.id))
                    toast({
                      title: "Activity Removed",
                      description: "The routine activity has been removed.",
                    })
                  }}
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
  )
}