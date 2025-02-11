"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Save,
  Clock,
  Timer,
  Trash2,
  GripVertical,
} from "lucide-react"

const ROUTINE_TYPES = [
  { value: "focus", label: "Focus Work" },
  { value: "exercise", label: "Exercise" },
  { value: "study", label: "Study" },
  { value: "meditation", label: "Meditation" },
  { value: "reading", label: "Reading" },
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
                        className="flex items-center gap-2 text-sm text-foreground/60"
                      >
                        <span className="w-5 text-right">{index + 1}.</span>
                        <span>{task.name}</span>
                        <span className="ml-auto">{task.duration}min</span>
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