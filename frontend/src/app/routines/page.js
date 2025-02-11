"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Template,
  Star,
} from "lucide-react"

// Predefined templates
const ROUTINE_TEMPLATES = {
  morning: [
    { id: 'm1', time: "07:00", activity: "Morning Meditation", duration: 15 },
    { id: 'm2', time: "07:15", activity: "Exercise", duration: 30 },
    { id: 'm3', time: "08:00", activity: "Breakfast & Planning", duration: 30 },
  ],
  work: [
    { id: 'w1', time: "09:00", activity: "Email Check", duration: 15 },
    { id: 'w2', time: "09:30", activity: "Deep Work Session", duration: 90 },
    { id: 'w3', time: "11:00", activity: "Team Meeting", duration: 30 },
  ],
  evening: [
    { id: 'e1', time: "18:00", activity: "Review Day", duration: 15 },
    { id: 'e2', time: "18:30", activity: "Wind Down Routine", duration: 45 },
    { id: 'e3', time: "19:30", activity: "Reading", duration: 30 },
  ],
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [newActivity, setNewActivity] = useState("")
  const [newDuration, setNewDuration] = useState("15")
  const [savedRoutines, setSavedRoutines] = useState([])
  const { toast } = useToast()

  // Load saved routines from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedRoutines')
    if (saved) {
      setSavedRoutines(JSON.parse(saved))
    }
  }, [])

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

  const applyTemplate = (templateRoutines) => {
    setRoutines(templateRoutines.map(routine => ({
      ...routine,
      id: Date.now() + Math.random()
    })))
    toast({
      title: "Template Applied",
      description: "Your routine has been updated with the selected template.",
    })
  }

  const saveCurrentRoutine = () => {
    const newSaved = [...savedRoutines, {
      id: Date.now(),
      name: `Routine ${savedRoutines.length + 1}`,
      routines: routines
    }]
    setSavedRoutines(newSaved)
    localStorage.setItem('savedRoutines', JSON.stringify(newSaved))
    toast({
      title: "Routine Saved",
      description: "Your current routine has been saved for future use.",
    })
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-display text-foreground">Daily Routine</h1>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-outline state-layer-hover"
                  >
                    <Template className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-surface-container-high border-outline">
                  <DialogHeader>
                    <DialogTitle className="font-display text-foreground">Choose a Template</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="morning" className="w-full">
                    <TabsList className="bg-surface-container">
                      <TabsTrigger value="morning">Morning</TabsTrigger>
                      <TabsTrigger value="work">Work</TabsTrigger>
                      <TabsTrigger value="evening">Evening</TabsTrigger>
                      <TabsTrigger value="saved">Saved</TabsTrigger>
                    </TabsList>
                    {Object.entries(ROUTINE_TEMPLATES).map(([key, templates]) => (
                      <TabsContent key={key} value={key}>
                        <Card className="material-elevation-1 p-4 cursor-pointer state-layer-hover"
                              onClick={() => applyTemplate(templates)}>
                          <div className="space-y-2">
                            {templates.map(routine => (
                              <div key={routine.id} className="flex gap-2 text-sm">
                                <span className="text-primary">{routine.time}</span>
                                <span>{routine.activity}</span>
                                <span className="text-foreground/60">{routine.duration}min</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </TabsContent>
                    ))}
                    <TabsContent value="saved">
                      <div className="space-y-2">
                        {savedRoutines.map(saved => (
                          <Card key={saved.id} 
                                className="material-elevation-1 p-4 cursor-pointer state-layer-hover"
                                onClick={() => applyTemplate(saved.routines)}>
                            <h3 className="font-display mb-2">{saved.name}</h3>
                            <div className="space-y-1">
                              {saved.routines.map(routine => (
                                <div key={routine.id} className="flex gap-2 text-sm">
                                  <span className="text-primary">{routine.time}</span>
                                  <span>{routine.activity}</span>
                                </div>
                              ))}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              <Button 
                onClick={saveCurrentRoutine}
                className="bg-primary-container text-primary state-layer-hover"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

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