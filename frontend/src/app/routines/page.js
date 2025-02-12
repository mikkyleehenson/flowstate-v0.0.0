"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Brain,
  Battery,
  Sun,
  Moon,
  Music2,
  VolumeX,
  Zap,
  ArrowRight,
  Network,
} from "lucide-react"

// Enhanced validation schema
const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  duration: z.string().min(1, "Duration is required"),
  energyLevels: z.object({
    mental: z.number().min(1).max(5),
    physical: z.number().min(1).max(5),
  }),
  complexity: z.number().min(1).max(5),
  timePreference: z.enum(["morning", "afternoon", "evening", "any"]),
  environment: z.object({
    noise: z.enum(["quiet", "ambient", "any"]),
    lighting: z.enum(["bright", "dim", "any"]),
    temperature: z.enum(["cool", "warm", "any"]),
  }),
  dependencies: z.array(z.string()),
  cognitiveLoad: z.number().min(1).max(10),
  recoveryTime: z.number().min(0),
  notes: z.string().optional(),
})

const routineSchema = z.object({
  name: z.string().min(1, "Routine name is required"),
  type: z.string(),
  tasks: z.array(taskSchema),
  pomodoro: z.object({
    enabled: z.boolean(),
    workRatio: z.number().min(50).max(90).optional(),
    minimumBreak: z.number().min(3).optional(),
    smartBreaks: z.boolean().optional(),
  }).optional(),
}).refine(data => {
  if (data.tasks.length > 0) {
    // Check for circular dependencies
    const graph = new Map()
    data.tasks.forEach(task => {
      graph.set(task.id, task.dependencies)
    })
    
    const hasCycle = (node, visited = new Set(), path = new Set()) => {
      if (path.has(node)) return true
      if (visited.has(node)) return false
      
      visited.add(node)
      path.add(node)
      
      const deps = graph.get(node) || []
      for (const dep of deps) {
        if (hasCycle(dep, visited, path)) return true
      }
      
      path.delete(node)
      return false
    }
    
    for (const taskId of graph.keys()) {
      if (hasCycle(taskId)) {
        return false
      }
    }
  }
  return true
}, "Circular dependencies detected")

const ROUTINE_TYPES = [
  { value: "focus", label: "Focus Work" },
  { value: "exercise", label: "Exercise" },
  { value: "study", label: "Study" },
  { value: "meditation", label: "Meditation" },
  { value: "reading", label: "Reading" },
]

// Energy level visualization component
function EnergyLevelIndicator({ mental, physical }) {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-1">
        <Brain className="w-4 h-4 text-jewel-sapphire" />
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-6 rounded-sm mx-0.5 ${
                i < mental 
                  ? 'bg-jewel-sapphire' 
                  : 'bg-jewel-sapphire/20'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Battery className="w-4 h-4 text-jewel-emerald" />
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-6 rounded-sm mx-0.5 ${
                i < physical 
                  ? 'bg-jewel-emerald' 
                  : 'bg-jewel-emerald/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Dependency visualization component
function DependencyGraph({ tasks, currentTask }) {
  return (
    <div className="p-4 bg-surface-container-low rounded-lg">
      <h4 className="text-sm font-medium mb-2">Dependencies</h4>
      <ScrollArea className="h-32">
        {currentTask.dependencies.map(depId => {
          const dep = tasks.find(t => t.id === depId)
          if (!dep) return null
          return (
            <div key={depId} className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-primary" />
              <ArrowRight className="w-4 h-4 text-foreground/40" />
              <span>{dep.name}</span>
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}

// Pomodoro configuration component
function PomodoroConfig({ form }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="pomodoro.enabled"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormLabel>Enable Pomodoro</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("pomodoro.enabled") && (
        <>
          <FormField
            control={form.control}
            name="pomodoro.workRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work/Break Ratio</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value || 75]}
                    onValueChange={([value]) => field.onChange(value)}
                    min={50}
                    max={90}
                    step={5}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  {field.value || 75}% work, {100 - (field.value || 75)}% break
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pomodoro.smartBreaks"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <FormLabel>Smart Break Scheduling</FormLabel>
                  <FormDescription>
                    Automatically adjust breaks based on task complexity
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
        </>
      )}
    </div>
  )
}

// Rest of the existing code remains the same...