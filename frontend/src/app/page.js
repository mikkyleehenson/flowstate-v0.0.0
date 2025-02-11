"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Clock, ListTodo, Calendar } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Flow<span className="text-blue-600">State</span>
        </h1>
        <p className="mb-8 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Your personalized ADHD productivity companion. Stay focused, organized, and accomplish more with tools designed for your unique way of thinking.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/tasks">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<ListTodo className="w-8 h-8 text-blue-600" />}
            title="Task Management"
            description="Organize tasks your way with flexible, hierarchical lists and visual boards"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-blue-600" />}
            title="Routine Builder"
            description="Create and maintain daily routines with drag-and-drop simplicity"
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8 text-blue-600" />}
            title="Focus Timer"
            description="Stay productive with customizable Pomodoro sessions and breaks"
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-blue-600" />}
            title="ADHD Tools"
            description="Access specialized tools and strategies designed for ADHD minds"
          />
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-50">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </Card>
  )
}