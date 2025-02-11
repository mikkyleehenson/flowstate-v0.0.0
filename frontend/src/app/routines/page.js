"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock } from "lucide-react"

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([
    { id: 1, name: "Morning Routine", duration: 60, type: "morning" },
    { id: 2, name: "Work Focus", duration: 90, type: "work" },
  ])

  return (
    <div className="min-h-screen bg-surface p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display">Daily Routines</h1>
          <Button className="bg-primary-container text-primary">
            New Routine
          </Button>
        </div>

        <div className="space-y-3">
          {routines.map((routine) => (
            <Card
              key={routine.id}
              className="material-elevation-1 p-4"
            >
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <h3 className="font-medium">{routine.name}</h3>
                  <p className="text-sm text-foreground/60">
                    {routine.duration} minutes
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}