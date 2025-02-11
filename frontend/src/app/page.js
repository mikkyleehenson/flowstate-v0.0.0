"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  ListTodo,
  Timer,
  Calendar,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export default function Home() {
  // Mock data for dashboard
  const dailyProgress = 65
  const upcomingTasks = [
    { id: 1, title: "Project Planning", due: "2:30 PM", priority: "high" },
    { id: 2, title: "Team Meeting", due: "4:00 PM", priority: "medium" },
    { id: 3, title: "Review Documents", due: "5:30 PM", priority: "low" },
  ]
  const activeRoutine = {
    name: "Work Focus",
    currentTask: "Deep Work Session",
    timeLeft: "45 minutes",
    progress: 35
  }

  return (
    <main className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display mb-2">Welcome Back</h1>
            <p className="text-foreground/60">Let's make today productive</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-primary-container text-primary">
              <Link href="/tasks">
                <ListTodo className="w-4 h-4 mr-2" />
                New Task
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-outline">
              <Link href="/routines">
                <Timer className="w-4 h-4 mr-2" />
                Start Routine
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="material-elevation-1 p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-foreground/60">Tasks Completed</p>
                <p className="text-2xl font-display">12/15</p>
              </div>
            </div>
          </Card>
          <Card className="material-elevation-1 p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-jewel-emerald/10">
                <TrendingUp className="w-6 h-6 text-jewel-emerald" />
              </div>
              <div>
                <p className="text-foreground/60">Focus Score</p>
                <p className="text-2xl font-display">85%</p>
              </div>
            </div>
          </Card>
          <Card className="material-elevation-1 p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-jewel-sapphire/10">
                <Clock className="w-6 h-6 text-jewel-sapphire" />
              </div>
              <div>
                <p className="text-foreground/60">Focus Time</p>
                <p className="text-2xl font-display">3h 45m</p>
              </div>
            </div>
          </Card>
          <Card className="material-elevation-1 p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-jewel-amethyst/10">
                <Brain className="w-6 h-6 text-jewel-amethyst" />
              </div>
              <div>
                <p className="text-foreground/60">Daily Streak</p>
                <p className="text-2xl font-display">5 days</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Routine */}
          <Card className="material-elevation-2 p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display">Active Routine</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/routines">View All</Link>
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">{activeRoutine.name}</p>
                  <p className="text-primary">{activeRoutine.timeLeft}</p>
                </div>
                <p className="text-foreground/60 text-sm mb-2">
                  Current: {activeRoutine.currentTask}
                </p>
                <Progress 
                  value={activeRoutine.progress} 
                  className="h-2 bg-surface-container-high"
                  indicatorClassName="bg-primary"
                />
              </div>
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="material-elevation-2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display">Upcoming Tasks</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/tasks">View All</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-md state-layer-hover"
                >
                  <AlertCircle className={`w-4 h-4 
                    ${task.priority === 'high' ? 'text-error' : 
                      task.priority === 'medium' ? 'text-jewel-topaz' : 
                      'text-jewel-emerald'}`} 
                  />
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-foreground/60">Due {task.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="material-elevation-2 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display">Daily Progress</h2>
            <p className="text-primary font-medium">{dailyProgress}%</p>
          </div>
          <Progress 
            value={dailyProgress} 
            className="h-3 bg-surface-container-high"
            indicatorClassName="bg-primary"
          />
        </Card>
      </div>
    </main>
  )
}