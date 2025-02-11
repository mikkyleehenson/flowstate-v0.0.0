"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./button"
import { Progress } from "./progress"
import { useToast } from "@/hooks/use-toast"
import { Play, Pause, RotateCcw } from "lucide-react"

export function PomodoroTimer({ 
  duration, 
  onComplete,
  pomodoroLength = 25,
  breakLength = 5,
}) {
  const [timeLeft, setTimeLeft] = useState(pomodoroLength * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [totalPomodoros] = useState(Math.ceil(duration / pomodoroLength))
  const timerRef = useRef(null)
  const { toast } = useToast()

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateProgress = () => {
    const currentLength = isBreak ? breakLength : pomodoroLength
    return 100 - ((timeLeft / (currentLength * 60)) * 100)
  }

  const startTimer = () => {
    setIsActive(true)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          if (isBreak) {
            // Break finished
            setPomodoroCount(prev => prev + 1)
            if (pomodoroCount + 1 < totalPomodoros) {
              toast({
                title: "Break Complete",
                description: "Time to focus! Starting next Pomodoro session.",
              })
              setIsBreak(false)
              return pomodoroLength * 60
            } else {
              // All pomodoros complete
              onComplete?.()
              toast({
                title: "Task Complete!",
                description: "You've completed all Pomodoro sessions for this task.",
              })
              return 0
            }
          } else {
            // Pomodoro finished
            toast({
              title: "Pomodoro Complete",
              description: "Time for a break!",
            })
            setIsBreak(true)
            return breakLength * 60
          }
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    setIsActive(false)
    clearInterval(timerRef.current)
  }

  const resetTimer = () => {
    clearInterval(timerRef.current)
    setIsActive(false)
    setIsBreak(false)
    setPomodoroCount(0)
    setTimeLeft(pomodoroLength * 60)
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground/60">
            {isBreak ? "Break Time" : "Focus Time"}
          </p>
          <p className="text-2xl font-display">
            {formatTime(timeLeft)}
          </p>
        </div>
        <div className="flex gap-2">
          {isActive ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={pauseTimer}
              className="text-primary state-layer-hover"
            >
              <Pause className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={startTimer}
              className="text-primary state-layer-hover"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={resetTimer}
            className="text-primary state-layer-hover"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Progress 
        value={calculateProgress()} 
        className="h-2 bg-surface-container-high"
        indicatorClassName={isBreak ? "bg-jewel-emerald" : "bg-primary"}
      />
      <div className="flex justify-between text-sm text-foreground/60">
        <span>Pomodoro {pomodoroCount + 1}/{totalPomodoros}</span>
        <span>{isBreak ? "Break" : "Focus"} Session</span>
      </div>
    </div>
  )
}