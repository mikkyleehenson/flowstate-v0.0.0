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
  DialogTrigger,
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
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Save,
  Clock,
  Timer,
  MoreVertical,
  List,
  GripVertical,
  Trash2,
  Info
} from "lucide-react"

const ROUTINE_TYPES = [
  { value: "focus", label: "Focus Work" },
  { value: "exercise", label: "Exercise" },
  { value: "study", label: "Study" },
  { value: "meditation", label: "Meditation" },
  { value: "reading", label: "Reading" },
]

// Time calculation utilities
const calculateTotalTime = (routine) => {
  let totalMinutes = 0
  
  // Calculate task times including Pomodoro breaks
  if (routine.tasks?.length > 0) {
    routine.tasks.forEach(task => {
      const taskDuration = parseInt(task.duration)
      if (routine.pomodoro) {
        const { workDuration, breakDuration } = routine.pomodoro
        const pomodoroCount = Math.ceil(taskDuration / workDuration)
        const breakCount = Math.max(pomodoroCount - 1, 0)
        totalMinutes += taskDuration + (breakCount * breakDuration)
      } else {
        totalMinutes += taskDuration
      }
    })
  } else {
    // Handle routines without tasks
    totalMinutes = parseInt(routine.duration)
    if (routine.pomodoro) {
      const { workDuration, breakDuration } = routine.pomodoro
      const pomodoroCount = Math.ceil(routine.duration / workDuration)
      const breakCount = Math.max(pomodoroCount - 1, 0)
      totalMinutes += breakCount * breakDuration
    }
  }

  return totalMinutes
}

const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

export default function RoutinesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState(null)
  const [routineToDelete, setRoutineToDelete] = useState(null)
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
      duration: "25",
      priority: "medium",
      enablePomodoro: true,
      pomodoroWork: "25",
      pomodoroBreak: "5",
      tasks: [],
    }
  })

  // Reset form when editing routine changes
  useEffect(() => {
    if (editingRoutine) {
      form.reset({
        name: editingRoutine.name,
        type: editingRoutine.type,
        duration: String(editingRoutine.duration),
        priority: editingRoutine.priority,
        enablePomodoro: !!editingRoutine.pomodoro,
        pomodoroWork: editingRoutine.pomodoro ? String(editingRoutine.pomodoro.workDuration) : "25",
        pomodoroBreak: editingRoutine.pomodoro ? String(editingRoutine.pomodoro.breakDuration) : "5",
        tasks: editingRoutine.tasks || [],
      })
    } else {
      form.reset({
        name: "",
        type: "focus",
        duration: "25",
        priority: "medium",
        enablePomodoro: true,
        pomodoroWork: "25",
        pomodoroBreak: "5",
        tasks: [],
      })
    }
  }, [editingRoutine, form])

  // Save routines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines))
  }, [routines])

  // Add task to form
  const addTask = () => {
    const tasks = form.getValues("tasks") || []
    form.setValue("tasks", [
      ...tasks,
      {
        id: Date.now(),
        name: "",
        duration: "15",
        completed: false
      }
    ])
  }

  // Remove task from form
  const removeTask = (taskId) => {
    const tasks = form.getValues("tasks")
    form.setValue("tasks", tasks.filter(task => task.id !== taskId))
  }

  const onSubmit = (data) => {
    const routineData = {
      id: editingRoutine?.id || Date.now(),
      name: data.name,
      type: data.type,
      duration: parseInt(data.duration),
      priority: data.priority,
      pomodoro: data.enablePomodoro ? {
        workDuration: parseInt(data.pomodoroWork),
        breakDuration: parseInt(data.pomodoroBreak),
      } : null,
      tasks: data.tasks,
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
        description: "Your new routine has been added to your collection.",
      })
    }

    setShowModal(false)
    setEditingRoutine(null)
  }

  const handleEdit = (routine) => {
    setEditingRoutine(routine)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingRoutine(null)
    form.reset()
  }

  const handleDeleteClick = (routine) => {
    setRoutineToDelete(routine)
  }

  const confirmDelete = () => {
    if (routineToDelete) {
      setRoutines(prev => prev.filter(r => r.id !== routineToDelete.id))
      toast({
        title: "Routine Deleted",
        description: "Your routine has been removed successfully.",
      })
      setRoutineToDelete(null)
    }
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

        {/* Routines List */}
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
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1 hover:text-primary">
                            <span>{formatDuration(calculateTotalTime(routine))}</span>
                            {routine.pomodoro && <Info className="w-3 h-3" />}
                          </TooltipTrigger>
                          {routine.pomodoro && (
                            <TooltipContent className="bg-surface-container-high border-outline">
                              <div className="space-y-1">
                                <p className="font-medium">Time Breakdown:</p>
                                <p>Work: {routine.pomodoro.workDuration}min sessions</p>
                                <p>Breaks: {routine.pomodoro.breakDuration}min</p>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                      <span>•</span>
                      <span>{ROUTINE_TYPES.find(t => t.value === routine.type)?.label}</span>
                    </div>
                  </div>
                  {routine.pomodoro && (
                    <div className="flex items-center gap-2 text-sm text-primary/80 bg-primary/5 px-2 py-1 rounded">
                      <Timer className="w-4 h-4" />
                      <span>{routine.pomodoro.workDuration}/{routine.pomodoro.breakDuration}</span>
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground/60 hover:text-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-surface-container-high border-outline">
                      <DropdownMenuItem 
                        className="state-layer-hover"
                        onClick={() => handleEdit(routine)}
                      >
                        Edit Routine
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="state-layer-hover text-error"
                        onClick={() => handleDeleteClick(routine)}
                      >
                        Delete Routine
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                        <span className="ml-auto">
                          {routine.pomodoro ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="flex items-center gap-1">
                                  {formatDuration(parseInt(task.duration))}
                                  <Info className="w-3 h-3" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-surface-container-high border-outline">
                                  <div className="space-y-1">
                                    <p>Work: {task.duration}min</p>
                                    <p>+ Breaks: {Math.floor(task.duration / routine.pomodoro.workDuration - 1) * routine.pomodoro.breakDuration}min</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            formatDuration(parseInt(task.duration))
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}

          {routines.length === 0 && (
            <div className="text-center py-8 text-foreground/60">
              <p>No routines yet. Create your first routine to get started!</p>
            </div>
          )}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={showModal} onOpenChange={handleCloseModal}>
          <DialogContent className="bg-surface-container-high border-outline sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingRoutine ? 'Edit Routine' : 'Create New Routine'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Form fields would be here - not shown in the diff */}
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

        {/* Add AlertDialog for delete confirmation */}
        <AlertDialog 
          open={!!routineToDelete} 
          onOpenChange={() => setRoutineToDelete(null)}
        >
          <AlertDialogContent className="bg-surface-container-high border-outline">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Routine</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this routine? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-error text-on-error"
                onClick={confirmDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  )
}