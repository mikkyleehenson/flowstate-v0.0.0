"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Save,
  Clock,
  Timer,
  Trash2,
  GripVertical,
  Brain,
  Sun,
  Moon,
  Music2,
  VolumeX,
  Zap,
  ListChecks,
  MessageSquare,
} from "lucide-react"

const ROUTINE_TYPES = [
  { value: "focus", label: "Focus Work" },
  { value: "exercise", label: "Exercise" },
  { value: "study", label: "Study" },
  { value: "meditation", label: "Meditation" },
  { value: "reading", label: "Reading" },
]

const ENERGY_LEVELS = [
  { value: "low", label: "Low Energy", icon: Zap, color: "text-jewel-emerald" },
  { value: "medium", label: "Medium Energy", icon: Zap, color: "text-jewel-topaz" },
  { value: "high", label: "High Energy", icon: Zap, color: "text-jewel-ruby" },
]

const FOCUS_TYPES = [
  { value: "deep", label: "Deep Work", icon: Brain },
  { value: "shallow", label: "Light Work", icon: Brain },
  { value: "physical", label: "Physical Activity", icon: Brain },
]

const ENVIRONMENT_NEEDS = [
  { value: "quiet", label: "Quiet Space", icon: VolumeX },
  { value: "music", label: "Background Music", icon: Music2 },
  { value: "any", label: "Any Environment", icon: Music2 },
]

const TIME_PREFERENCES = [
  { value: "morning", label: "Morning", icon: Sun },
  { value: "afternoon", label: "Afternoon", icon: Sun },
  { value: "evening", label: "Evening", icon: Moon },
]

// Form validation schema
const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  duration: z.string().min(1, "Duration is required"),
  energyLevel: z.string(),
  focusType: z.string(),
  environment: z.string(),
  timePreference: z.string(),
  notes: z.string(),
  motivation: z.string(),
  dependencies: z.array(z.string()),
  successRate: z.number().min(0).max(100).optional(),
  completionCount: z.number().min(0).optional(),
  breakPreference: z.object({
    type: z.enum(["standard", "custom"]),
    workDuration: z.number().min(5),
    breakDuration: z.number().min(1),
    longBreakInterval: z.number().min(1),
    longBreakDuration: z.number().min(5),
  }),
})

const routineSchema = z.object({
  name: z.string().min(1, "Routine name is required"),
  type: z.string(),
  tasks: z.array(taskSchema),
})

// Break preference options
const BREAK_PREFERENCES = {
  standard: {
    workDuration: 25,
    breakDuration: 5,
    longBreakInterval: 4,
    longBreakDuration: 15,
  },
  custom: {
    workDuration: 45,
    breakDuration: 10,
    longBreakInterval: 3,
    longBreakDuration: 20,
  },
}

// Sortable task component
function SortableTask({ task, index, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="p-4 bg-surface-container-low cursor-move">
        <div className="flex items-center gap-4">
          <GripVertical className="w-5 h-5 text-foreground/40" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <EnergyLevelIndicator level={task.energyLevel} />
              <span>{task.name}</span>
              {task.successRate !== null && (
                <Badge variant="outline" className="ml-auto">
                  {task.successRate}% Success
                </Badge>
              )}
            </div>
            {task.dependencies?.length > 0 && (
              <div className="mt-2 flex gap-2">
                {task.dependencies.map(depId => {
                  const depTask = props.tasks.find(t => t.id === depId)
                  return (
                    <Badge key={depId} variant="outline" className="text-xs">
                      Requires: {depTask?.name}
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

// Energy level indicator component
function EnergyLevelIndicator({ level }) {
  const colors = {
    low: "bg-jewel-emerald/20 text-jewel-emerald",
    medium: "bg-jewel-topaz/20 text-jewel-topaz",
    high: "bg-jewel-ruby/20 text-jewel-ruby",
  }

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </div>
  )
}

export default function RoutinesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState(null)
  const [routines, setRoutines] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routines')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: "",
      type: "focus",
      tasks: [],
    }
  })

  // Save routines to localStorage
  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines))
  }, [routines])

  // Reset form when editing routine changes
  useEffect(() => {
    if (editingRoutine) {
      form.reset({
        name: editingRoutine.name,
        type: editingRoutine.type,
        tasks: editingRoutine.tasks || [],
      })
    } else {
      form.reset({
        name: "",
        type: "focus",
        tasks: [],
      })
    }
  }, [editingRoutine, form])

  const addTask = () => {
    const currentTasks = form.getValues("tasks") || []
    form.setValue("tasks", [
      ...currentTasks,
      {
        id: Date.now(),
        name: "",
        duration: "15",
        energyLevel: "medium",
        focusType: "shallow",
        environment: "any",
        timePreference: "morning",
        notes: "",
        dependencies: [],
        successRate: null,
        completionCount: 0,
        breakPreference: {
          type: "standard",
          ...BREAK_PREFERENCES.standard
        },
        motivation: "",
      }
    ])
  }

  const removeTask = (taskIndex) => {
    const currentTasks = form.getValues("tasks")
    form.setValue("tasks", currentTasks.filter((_, index) => index !== taskIndex))
  }

  // Handle task reordering
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const tasks = form.getValues("tasks")
      const oldIndex = tasks.findIndex(t => t.id === active.id)
      const newIndex = tasks.findIndex(t => t.id === over.id)
      
      const newTasks = [...tasks]
      const [movedTask] = newTasks.splice(oldIndex, 1)
      newTasks.splice(newIndex, 0, movedTask)
      
      form.setValue("tasks", newTasks)
    }
  }

  const onSubmit = (data) => {
    const totalDuration = data.tasks.reduce((sum, task) => sum + parseInt(task.duration), 0)
    
    const routineData = {
      id: editingRoutine?.id || Date.now(),
      name: data.name,
      type: data.type,
      tasks: data.tasks,
      duration: totalDuration,
      createdAt: editingRoutine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (editingRoutine) {
      setRoutines(prev => prev.map(r => 
        r.id === editingRoutine.id ? routineData : r
      ))
      toast({
        title: "Routine Updated",
        description: "Your routine has been updated successfully.",
      })
    } else {
      setRoutines(prev => [...prev, routineData])
      toast({
        title: "Routine Created",
        description: "Your new routine has been created successfully.",
      })
    }

    setShowModal(false)
    setEditingRoutine(null)
    form.reset()
  }

  const handleEdit = (routine) => {
    setEditingRoutine(routine)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display">Daily Routines</h1>
          <Button 
            className="bg-primary-container text-primary"
            onClick={() => {
              setEditingRoutine(null)
              setShowModal(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Routine
          </Button>
        </div>

        <div className="space-y-3">
          {routines.map((routine) => (
            <Card
              key={routine.id}
              className="material-elevation-1 p-4 state-layer-hover"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium">{routine.name}</h3>
                    <p className="text-sm text-foreground/60">
                      {routine.duration} minutes • {ROUTINE_TYPES.find(t => t.value === routine.type)?.label}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleEdit(routine)}
                    className="text-primary"
                  >
                    Edit
                  </Button>
                </div>

                {routine.tasks?.length > 0 && (
                  <div className="pl-9 space-y-2">
                    {routine.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span>{task.name}</span>
                          <span>{task.duration}min</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className={`${ENERGY_LEVELS.find(e => e.value === task.energyLevel)?.color}`}>
                            {ENERGY_LEVELS.find(e => e.value === task.energyLevel)?.label}
                          </Badge>
                          <Badge variant="outline">
                            {FOCUS_TYPES.find(f => f.value === task.focusType)?.label}
                          </Badge>
                          {task.notes && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Notes
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-surface-container-high border-outline sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingRoutine ? 'Edit Routine' : 'Create New Routine'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routine Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter routine name..." 
                          className="bg-surface-container-low border-outline"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-surface-container-low border-outline">
                            <SelectValue placeholder="Select routine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-surface-container-high border-outline">
                          {ROUTINE_TYPES.map(type => (
                            <SelectItem 
                              key={type.value} 
                              value={type.value}
                              className="state-layer-hover"
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Tasks</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTask}
                      className="border-outline state-layer-hover"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>

                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={form.watch("tasks")}
                      strategy={verticalListSortingStrategy}
                    >
                      {form.watch("tasks")?.map((task, index) => (
                        <SortableTask 
                          key={task.id} 
                          task={task} 
                          index={index} 
                          tasks={form.watch("tasks")}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>

                <DialogFooter>
                  <Button 
                    type="submit"
                    className="bg-primary-container text-primary w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingRoutine ? 'Update Routine' : 'Create Routine'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}