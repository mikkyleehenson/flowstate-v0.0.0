"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Save,
  Clock,
  Timer,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

// Form validation schema
const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  duration: z.string().min(1, "Duration is required"),
  energyLevel: z.string(),
  notes: z.string().optional(),
})

const routineSchema = z.object({
  name: z.string().min(1, "Routine name is required"),
  type: z.string(),
  tasks: z.array(taskSchema),
})

const ROUTINE_TYPES = [
  { value: "focus", label: "Focus Work" },
  { value: "exercise", label: "Exercise" },
  { value: "study", label: "Study" },
  { value: "meditation", label: "Meditation" },
  { value: "reading", label: "Reading" },
]

const ENERGY_LEVELS = [
  { value: "low", label: "Low Energy", color: "bg-jewel-emerald/20 text-jewel-emerald" },
  { value: "medium", label: "Medium Energy", color: "bg-jewel-topaz/20 text-jewel-topaz" },
  { value: "high", label: "High Energy", color: "bg-jewel-ruby/20 text-jewel-ruby" },
]

function EnergyLevelBadge({ level }) {
  const energyLevel = ENERGY_LEVELS.find(e => e.value === level)
  return (
    <Badge className={`${energyLevel?.color} border-none`}>
      {energyLevel?.label}
    </Badge>
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
        notes: "",
      }
    ])
  }

  const removeTask = (taskIndex) => {
    const currentTasks = form.getValues("tasks")
    form.setValue("tasks", currentTasks.filter((_, index) => index !== taskIndex))
  }

  const moveTask = (index, direction) => {
    const tasks = form.getValues("tasks")
    const newIndex = direction === "up" ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < tasks.length) {
      const newTasks = [...tasks]
      const temp = newTasks[index]
      newTasks[index] = newTasks[newIndex]
      newTasks[newIndex] = temp
      form.setValue("tasks", newTasks)
    }
  }

  const renderTaskCard = (task, index) => (
    <Card key={task.id} className="p-4 bg-surface-container-low">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => moveTask(index, "up")}
            disabled={index === 0}
            className="h-6 w-6"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => moveTask(index, "down")}
            disabled={index === form.getValues("tasks").length - 1}
            className="h-6 w-6"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 space-y-4">
          <FormField
            control={form.control}
            name={`tasks.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter task name..." 
                    className="bg-surface-container-low border-outline"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`tasks.${index}.duration`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="Enter duration" 
                    className="bg-surface-container-low border-outline"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`tasks.${index}.energyLevel`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-surface-container border-outline">
                      <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="!bg-surface-container-high border-outline">
                    {ENERGY_LEVELS.map(level => (
                      <SelectItem 
                        key={level.value} 
                        value={level.value}
                        className="state-layer-hover"
                      >
                        <EnergyLevelBadge level={level.value} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`tasks.${index}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Additional notes..." 
                    className="bg-surface-container-low border-outline"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeTask(index)}
          className="text-error state-layer-hover"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )

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
                          <EnergyLevelBadge level={task.energyLevel} />
                          {task.notes && (
                            <Badge variant="outline">
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

                  {form.watch("tasks")?.map((task, index) => renderTaskCard(task, index))}
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