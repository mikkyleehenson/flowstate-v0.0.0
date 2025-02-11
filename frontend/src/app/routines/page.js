"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
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
        estimatedDuration: "15",
        actualDuration: null,
        successRate: null,
        completionCount: 0,
        breakPreference: "standard",
        motivation: "",
      }
    ])
  }

  const removeTask = (taskIndex) => {
    const currentTasks = form.getValues("tasks")
    form.setValue("tasks", currentTasks.filter((_, index) => index !== taskIndex))
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

                  {form.watch("tasks")?.map((task, index) => (
                    <Card key={task.id} className="p-4 bg-surface-container-low">
                      <div className="flex items-center gap-4">
                        <GripVertical className="w-5 h-5 text-foreground/40" />
                        <div className="flex-1 space-y-2">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Task name..."
                                    className="bg-surface-container border-outline"
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
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-surface-container border-outline">
                                      <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-surface-container-high border-outline">
                                    {[5, 10, 15, 20, 25, 30, 45, 60].map((mins) => (
                                      <SelectItem 
                                        key={mins} 
                                        value={String(mins)}
                                      >
                                        {mins} minutes
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
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
                                    <SelectContent>
                                      {ENERGY_LEVELS.map(level => (
                                        <SelectItem 
                                          key={level.value} 
                                          value={level.value}
                                          className="flex items-center gap-2"
                                        >
                                          <level.icon className={`w-4 h-4 ${level.color}`} />
                                          {level.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`tasks.${index}.focusType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Focus Type</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-surface-container border-outline">
                                        <SelectValue placeholder="Select focus type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {FOCUS_TYPES.map(type => (
                                        <SelectItem 
                                          key={type.value} 
                                          value={type.value}
                                          className="flex items-center gap-2"
                                        >
                                          <type.icon className="w-4 h-4" />
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`tasks.${index}.environment`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Environment</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-surface-container border-outline">
                                        <SelectValue placeholder="Select environment" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {ENVIRONMENT_NEEDS.map(env => (
                                        <SelectItem 
                                          key={env.value} 
                                          value={env.value}
                                          className="flex items-center gap-2"
                                        >
                                          <env.icon className="w-4 h-4" />
                                          {env.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`tasks.${index}.timePreference`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Best Time</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-surface-container border-outline">
                                        <SelectValue placeholder="Select time" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {TIME_PREFERENCES.map(time => (
                                        <SelectItem 
                                          key={time.value} 
                                          value={time.value}
                                          className="flex items-center gap-2"
                                        >
                                          <time.icon className="w-4 h-4" />
                                          {time.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`tasks.${index}.notes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes & Instructions</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add any helpful notes or instructions..."
                                    className="bg-surface-container border-outline resize-none h-20"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tasks.${index}.motivation`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Motivation / Reward</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="What makes this task worthwhile?"
                                    className="bg-surface-container border-outline"
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
                  ))}
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