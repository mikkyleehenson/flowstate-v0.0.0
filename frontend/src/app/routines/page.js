"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Play,
  Pause,
  RotateCcw,
  GripVertical,
  X,
  Save,
  LayoutTemplate,
  Timer,
  Plus,
  Check,
} from "lucide-react"

// Predefined templates
const DEFAULT_TEMPLATES = {
  morning: {
    name: "Morning Routine",
    routines: [
      { id: 'm1', time: "07:00", activity: "Morning Meditation", duration: 15, progress: 0, isActive: false },
      { id: 'm2', time: "07:15", activity: "Exercise", duration: 30, progress: 0, isActive: false },
      { id: 'm3', time: "07:45", activity: "Breakfast & Planning", duration: 30, progress: 0, isActive: false },
    ]
  },
  work: {
    name: "Work Focus",
    routines: [
      { id: 'w1', time: "09:00", activity: "Email Check", duration: 15, progress: 0, isActive: false },
      { id: 'w2', time: "09:15", activity: "Deep Work Session", duration: 90, progress: 0, isActive: false },
      { id: 'w3', time: "10:45", activity: "Quick Break", duration: 15, progress: 0, isActive: false },
    ]
  },
  evening: {
    name: "Evening Winddown",
    routines: [
      { id: 'e1', time: "18:00", activity: "Day Review", duration: 15, progress: 0, isActive: false },
      { id: 'e2', time: "18:15", activity: "Light Exercise", duration: 30, progress: 0, isActive: false },
      { id: 'e3', time: "18:45", activity: "Reading", duration: 30, progress: 0, isActive: false },
    ]
  }
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([
    { id: 1, time: "09:00", activity: "Morning Meditation", duration: 15, progress: 0, isActive: false },
    { id: 2, time: "09:30", activity: "Check Emails", duration: 30, progress: 0, isActive: false },
    { id: 3, time: "10:30", activity: "Deep Work Session", duration: 60, progress: 0, isActive: false },
  ])
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [activeTimer, setActiveTimer] = useState(null)
  const timerRef = useRef(null)
  const timeoutRef = useRef(null)
  const [templates, setTemplates] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routineTemplates')
      return saved ? { ...DEFAULT_TEMPLATES, ...JSON.parse(saved) } : DEFAULT_TEMPLATES
    }
    return DEFAULT_TEMPLATES
  })
  const [newTemplateName, setNewTemplateName] = useState("")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startTimer = (routineId) => {
    if (activeTimer) {
      clearInterval(timerRef.current)
      setRoutines(prev => prev.map(r => ({...r, isActive: false})))
    }

    setActiveTimer(routineId)
    setRoutines(prev => prev.map(r => 
      r.id === routineId ? {...r, isActive: true} : {...r, isActive: false}
    ))

    timerRef.current = setInterval(() => {
      setRoutines(prev => {
        const updatedRoutines = prev.map(r => {
          if (r.id === routineId) {
            const newProgress = Math.min(r.progress + (100 / (r.duration * 60)), 100)
            if (newProgress === 100) {
              clearInterval(timerRef.current)
              toast({
                title: "Routine Complete!",
                description: `${r.activity} has been completed.`,
              })
            }
            return {...r, progress: newProgress}
          }
          return r
        })
        return updatedRoutines
      })
    }, 1000)
  }

  const pauseTimer = () => {
    clearInterval(timerRef.current)
    setActiveTimer(null)
    setRoutines(prev => prev.map(r => ({...r, isActive: false})))
  }

  const resetTimer = (routineId) => {
    if (activeTimer === routineId) {
      clearInterval(timerRef.current)
      setActiveTimer(null)
    }
    setRoutines(prev => prev.map(r => 
      r.id === routineId ? {...r, progress: 0, isActive: false} : r
    ))
  }

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

  const applyTemplate = (templateRoutines) => {
    const newRoutines = templateRoutines.map((routine, index) => ({
      ...routine,
      id: Date.now() + index,
      progress: 0,
      isActive: false
    }))
    setRoutines(newRoutines)
    toast({
      title: "Template Applied",
      description: "Your routine has been updated with the selected template.",
    })
  }

  const saveAsTemplate = () => {
    if (!newTemplateName.trim()) return

    const newTemplate = {
      name: newTemplateName,
      routines: routines.map(r => ({
        ...r,
        progress: 0,
        isActive: false
      }))
    }

    const newTemplates = {
      ...templates,
      [`custom_${Date.now()}`]: newTemplate
    }

    setTemplates(newTemplates)
    localStorage.setItem('routineTemplates', JSON.stringify(newTemplates))
    setSaveDialogOpen(false)
    setNewTemplateName("")

    toast({
      title: "Template Saved",
      description: "Your current routine has been saved as a template.",
    })
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display">Daily Routine</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-outline state-layer-hover"
                >
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-surface-container-high border-outline">
                <DialogHeader>
                  <DialogTitle className="font-display">Choose a Template</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="morning" className="w-full">
                  <TabsList className="bg-surface-container w-full justify-start">
                    <TabsTrigger value="morning">Morning</TabsTrigger>
                    <TabsTrigger value="work">Work</TabsTrigger>
                    <TabsTrigger value="evening">Evening</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="h-[400px] mt-4">
                    {Object.entries(templates).map(([key, template]) => (
                      <TabsContent key={key} value={key.split('_')[0]}>
                        <Card 
                          className="material-elevation-1 p-4 cursor-pointer state-layer-hover mb-4"
                          onClick={() => applyTemplate(template.routines)}
                        >
                          <h3 className="font-display text-lg mb-2">{template.name}</h3>
                          <div className="space-y-2">
                            {template.routines.map(routine => (
                              <div key={routine.id} className="flex gap-2 text-sm">
                                <span className="text-primary w-16">{routine.time}</span>
                                <span className="flex-1">{routine.activity}</span>
                                <span className="text-foreground/60">{routine.duration}min</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </TabsContent>
                    ))}
                  </ScrollArea>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary-container text-primary state-layer-hover"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-surface-container-high border-outline">
                <DialogHeader>
                  <DialogTitle className="font-display">Save as Template</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Template name..."
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="bg-surface-container-low border-outline"
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={saveAsTemplate}
                    className="bg-primary-container text-primary state-layer-hover"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              className={`material-elevation-1 p-4 transition-all duration-200
                ${dragOverIndex === index ? 'translate-y-2 material-elevation-2' : ''}
                ${draggedItem?.id === routine.id ? 'opacity-50' : ''}
              `}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-foreground/40 cursor-move" />
                  <div className="w-20 font-display text-primary">
                    {routine.time}
                  </div>
                  <div className="flex-1">{routine.activity}</div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-foreground/60" />
                    <span className="text-foreground/60">
                      {routine.duration} min
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {routine.isActive ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => pauseTimer()}
                        className="text-primary state-layer-hover"
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startTimer(routine.id)}
                        className="text-primary state-layer-hover"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => resetTimer(routine.id)}
                      className="text-primary state-layer-hover"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
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
                </div>
                <Progress 
                  value={routine.progress} 
                  className="h-1 bg-surface-container-high"
                  indicatorClassName="bg-primary"
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}