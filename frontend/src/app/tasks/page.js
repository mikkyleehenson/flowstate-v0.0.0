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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-50">
            Tasks
          </h1>

          {/* Add Task Input */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask}>
              <PlusCircle className="w-5 h-5 mr-1" /> Add Task
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                  />
                  <button
                    onClick={() => toggleExpand(task.id)}
                    className="flex items-center gap-2 flex-1"
                  >
                    {task.subtasks.length > 0 &&
                      (task.expanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      ))}
                    <span
                      className={`${
                        task.completed ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Add Subtask</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Subtasks */}
                {task.expanded && task.subtasks.length > 0 && (
                  <div className="ml-6 mt-2 space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() =>
                            toggleComplete(subtask.id, true, task.id)
                          }
                        />
                        <span
                          className={`${
                            subtask.completed ? "line-through text-slate-500" : ""
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