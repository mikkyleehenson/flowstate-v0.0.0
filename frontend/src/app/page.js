"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Clock, ListTodo, Calendar } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-24">
          <h1 className="text-7xl font-display mb-6 tracking-tight text-foreground">
            Flow<span className="text-jewel-amethyst">State</span>
          </h1>
          <p className="text-xl mb-8 text-foreground/80 max-w-2xl font-content">
            Your personalized ADHD productivity companion. Stay focused, organized, and accomplish more with tools designed for your unique way of thinking.
          </p>
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="material-elevation-1 state-layer-hover state-layer-active"
            >
              <Link href="/tasks">Get Started</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="state-layer-hover state-layer-active"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <ListTodo className="w-8 h-8 text-jewel-sapphire" />,
              title: "Task Management",
              description: "Organize tasks your way with flexible, hierarchical lists"
            },
            {
              icon: <Calendar className="w-8 h-8 text-jewel-emerald" />,
              title: "Routine Builder",
              description: "Create and maintain daily routines with drag-and-drop simplicity"
            },
            {
              icon: <Clock className="w-8 h-8 text-jewel-ruby" />,
              title: "Focus Timer",
              description: "Stay productive with customizable Pomodoro sessions"
            },
            {
              icon: <Brain className="w-8 h-8 text-jewel-amethyst" />,
              title: "ADHD Tools",
              description: "Access specialized tools designed for ADHD minds"
            }
          ].map((feature, i) => (
            <Card 
              key={i} 
              className="material-elevation-1 p-6 state-layer-hover"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-display mb-2">{feature.title}</h3>
                <p className="text-foreground/80 font-content">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}