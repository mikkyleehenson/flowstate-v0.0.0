"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
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

  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      activity: "",
      duration: "15"
    }
  })

  const onSubmit = (data) => {
    const lastRoutine = routines[routines.length - 1]
    const lastTime = lastRoutine ? lastRoutine.time : "09:00"
    
    const [hours, minutes] = lastTime.split(":").map(Number)
    const newMinutes = minutes + Number(data.duration)
    const newHours = hours + Math.floor(newMinutes / 60)
    const finalMinutes = newMinutes % 60
    
    const newTime = `${String(newHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`
    
    setRoutines([
      ...routines,
      {
        id: Date.now(),
        time: newTime,
        activity: data.activity,
        duration: Number(data.duration),
      },
    ])
    form.reset()
    
    toast({
      title: "Activity Added",
      description: "Your new routine activity has been added.",
    })
  }

  const saveRoutine = () => {
    toast({
      title: "Routine Saved",
      description: "Your routine has been saved successfully.",
    })
  }

  const removeRoutine = (id) => {
    setRoutines(routines.filter(routine => routine.id !== id))
    toast({
      title: "Activity Removed",
      description: "The routine activity has been removed.",
    })
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
              onClick={() => {
                toast({
                  title: "Templates",
                  description: "Template feature coming soon!",
                })
              }}
            >
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button 
              onClick={saveRoutine}
              className="bg-primary-container text-primary state-layer-hover"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6">
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Add a new activity..."
                      {...field}
                      className="bg-surface-container-low border-outline"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px] bg-surface-container-low border-outline">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-surface-container-high border-outline">
                      {[15, 30, 45, 60, 90, 120].map((mins) => (
                        <SelectItem key={mins} value={String(mins)}>
                          {mins} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              className="bg-primary-container text-primary state-layer-hover state-layer-active"
            >
              <PlusCircle className="w-5 h-5 mr-1" /> Add
            </Button>
          </form>
        </Form>

        <div className="space-y-3">
          {routines.map((routine) => (
            <Card
              key={routine.id}
              className="material-elevation-1 p-4 state-layer-hover"
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
  )
}