"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  PlusCircle,
  ChevronDown,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Project Planning",
      completed: false,
      expanded: true,
      subtasks: [
        { id: 2, title: "Brainstorm ideas", completed: false },
        { id: 3, title: "Create timeline", completed: false },
      ],
    },
  ])

  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (!newTask.trim()) return
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        completed: false,
        expanded: false,
        subtasks: [],
      },
    ])
    setNewTask("")
  }

  const toggleExpand = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, expanded: !task.expanded } : task
      )
    )
  }

  const toggleComplete = (taskId, isSubtask = false, parentId = null) => {
    if (!isSubtask) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      )
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === parentId
            ? {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === taskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
                ),
              }
            : task
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto p-4">
        <Card className="material-elevation-2 p-6">
          <h1 className="text-3xl font-display mb-6 text-foreground">Tasks</h1>

          {/* Add Task Input */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="flex-1 bg-surface-container-low border-outline"
            />
            <Button 
              onClick={addTask}
              className="bg-primary-container text-primary state-layer-hover state-layer-active"
            >
              <PlusCircle className="w-5 h-5 mr-1" /> Add Task
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="material-elevation-1 p-4 state-layer-hover"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    className="border-outline data-[state=checked]:bg-primary-container data-[state=checked]:text-primary"
                  />
                  <button
                    onClick={() => toggleExpand(task.id)}
                    className="flex items-center gap-2 flex-1 state-layer-hover rounded-md p-1"
                  >
                    {task.subtasks.length > 0 &&
                      (task.expanded ? (
                        <ChevronDown className="w-4 h-4 text-foreground/60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-foreground/60" />
                      ))}
                    <span
                      className={`${
                        task.completed ? "line-through text-foreground/50" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="state-layer-hover"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="bg-surface-container-high border-outline"
                    >
                      <DropdownMenuItem className="state-layer-hover">
                        Add Subtask
                      </DropdownMenuItem>
                      <DropdownMenuItem className="state-layer-hover">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-error state-layer-hover">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Subtasks */}
                {task.expanded && task.subtasks.length > 0 && (
                  <div className="ml-6 mt-2 space-y-2 p-2 bg-surface-container-lowest rounded-md">
                    {task.subtasks.map((subtask) => (
                      <div 
                        key={subtask.id} 
                        className="flex items-center gap-2 p-2 rounded-md state-layer-hover"
                      >
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() =>
                            toggleComplete(subtask.id, true, task.id)
                          }
                          className="border-outline data-[state=checked]:bg-primary-container data-[state=checked]:text-primary"
                        />
                        <span
                          className={`${
                            subtask.completed ? "line-through text-foreground/50" : ""
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}