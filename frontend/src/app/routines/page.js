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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Save,
  Clock,
  Timer,
  Template,
  Star,
} from "lucide-react"

const ROUTINE_TYPES = [
  { value: "focus", label: "Focus Work" },
  { value: "exercise", label: "Exercise" },
  { value: "study", label: "Study" },
  { value: "meditation", label: "Meditation" },
  { value: "reading", label: "Reading" },
]

const PRIORITY_LEVELS = [
  { value: "low", label: "Low Priority", color: "text-jewel-emerald" },
  { value: "medium", label: "Medium Priority", color: "text-jewel-topaz" },
  { value: "high", label: "High Priority", color: "text-jewel-ruby" },
  { value: "critical", label: "Critical", color: "text-error" },
]

export default function RoutinesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [templates, setTemplates] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routineTemplates')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
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
      templateName: "",
      templateCategory: "custom",
    }
  })

  const onSubmit = (data) => {
    const routineData = {
      name: data.name,
      type: data.type,
      duration: parseInt(data.duration),
      priority: data.priority,
      pomodoro: data.enablePomodoro ? {
        workDuration: parseInt(data.pomodoroWork),
        breakDuration: parseInt(data.pomodoroBreak),
      } : null,
    }

    if (saveAsTemplate) {
      const templateKey = `${data.templateCategory}_${Date.now()}`
      const newTemplate = {
        name: data.templateName || data.name,
        category: data.templateCategory,
        routine: routineData,
      }

      const updatedTemplates = {
        ...templates,
        [templateKey]: newTemplate,
      }

      setTemplates(updatedTemplates)
      localStorage.setItem('routineTemplates', JSON.stringify(updatedTemplates))

      toast({
        title: "Template Saved",
        description: "Your routine template has been saved successfully.",
      })
    }

    setShowCreateModal(false)
    form.reset()
  }

  // Add template saving section to the form
  const renderTemplateSection = () => (
    <div className="space-y-4 border-t border-outline/20 pt-4 mt-4">
      <FormField
        control={form.control}
        name="saveAsTemplate"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-outline p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Save as Template</FormLabel>
              <FormDescription>
                Save this routine as a reusable template
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={saveAsTemplate}
                onCheckedChange={setSaveAsTemplate}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {saveAsTemplate && (
        <>
          <FormField
            control={form.control}
            name="templateName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter template name..."
                    className="bg-surface-container-low border-outline"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="templateCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-surface-container-low border-outline">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-surface-container-high border-outline">
                    <SelectItem value="morning">Morning Routines</SelectItem>
                    <SelectItem value="work">Work Routines</SelectItem>
                    <SelectItem value="evening">Evening Routines</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-surface p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display">Daily Routines</h1>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-primary-container text-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Routine
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface-container-high border-outline sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-display">Create New Routine</DialogTitle>
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
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-surface-container-low border-outline">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-surface-container-high border-outline">
                            {PRIORITY_LEVELS.map(priority => (
                              <SelectItem 
                                key={priority.value} 
                                value={priority.value}
                                className={`state-layer-hover ${priority.color}`}
                              >
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                  {renderTemplateSection()}

                  <DialogFooter>
                    <Button 
                      type="submit"
                      className="bg-primary-container text-primary w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveAsTemplate ? 'Save as Template' : 'Create Routine'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Existing routines list */}
        {/* ... */}
      </Card>
    </div>
  )
}