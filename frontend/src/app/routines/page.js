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
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Save,
  Clock,
  Timer,
  MoreVertical,
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
      })
    }
  }, [editingRoutine, form])

  // Save routines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines))
  }, [routines])

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
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <h3 className="font-medium">{routine.name}</h3>
                  <p className="text-sm text-foreground/60">
                    {routine.duration} minutes • {ROUTINE_TYPES.find(t => t.value === routine.type)?.label}
                  </p>
                </div>
                {routine.pomodoro && (
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
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
            </Card>
          ))}

          {routines.length === 0 && (
            <div className="text-center py-8 text-foreground/60">
              <p>No routines yet. Create your first routine to get started!</p>
            </div>
          )}
        </div>

        {/* Create/Edit Dialog */}
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

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="5"
                          className="bg-surface-container-low border-outline"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enablePomodoro"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-outline p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Pomodoro Timer</FormLabel>
                        <FormDescription>
                          Enable Pomodoro technique for this routine
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("enablePomodoro") && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pomodoroWork"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="5"
                              className="bg-surface-container-low border-outline"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pomodoroBreak"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Break Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              className="bg-surface-container-low border-outline"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

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
              <AlertDialogTitle className="font-display text-xl">
                Delete Routine
              </AlertDialogTitle>
              <AlertDialogDescription className="text-foreground/60">
                Are you sure you want to delete "{routineToDelete?.name}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel 
                className="bg-surface-container-low border-outline text-foreground 
                  hover:bg-surface-container state-layer-hover"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-error text-error-foreground hover:bg-error/90 
                  state-layer-hover"
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