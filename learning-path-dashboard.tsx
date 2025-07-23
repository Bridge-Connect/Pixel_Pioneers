"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../lib/firebase"
import { GraduationCap, Palette, MessageSquare, Star, ArrowLeft, BookOpen, Trophy, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface CategoryCard {
  id: string
  title: string
  icon: React.ComponentType<any>
  description: string
  progress: number
  totalLessons: number
  color: string
}

const categories: CategoryCard[] = [
  {
    id: "academic-subjects",
    title: "Academic Subjects",
    icon: GraduationCap,
    description: "Learn alphabets, numbers, and basic concepts",
    progress: 0,
    totalLessons: 26,
    color: "bg-blue-500",
  },
  {
    id: "life-skills",
    title: "Life Skills",
    icon: Palette,
    description: "Daily activities and practical skills",
    progress: 0,
    totalLessons: 20,
    color: "bg-green-500",
  },
  {
    id: "daily-conversations",
    title: "Daily Conversations",
    icon: MessageSquare,
    description: "Common phrases and expressions",
    progress: 0,
    totalLessons: 30,
    color: "bg-purple-500",
  },
  {
    id: "important-vocabulary",
    title: "Important Vocabulary",
    icon: Star,
    description: "Essential words and meanings",
    progress: 0,
    totalLessons: 50,
    color: "bg-orange-500",
  },
]

export default function LearningPathDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<Record<string, number>>({})
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        loadUserProgress(currentUser.uid)
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadUserProgress = async (userId: string) => {
    // Simulate loading progress from Firebase
    // In real implementation, fetch from Firestore
    const mockProgress = {
      "academic-subjects": 5,
      "life-skills": 2,
      "daily-conversations": 0,
      "important-vocabulary": 8,
    }
    setUserProgress(mockProgress)
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/learning-path/${categoryId}`)
  }

  const calculateProgressPercentage = (categoryId: string) => {
    const progress = userProgress[categoryId] || 0
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? Math.round((progress / category.totalLessons) * 100) : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>

            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Learning Path</h1>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Level 1
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Learning Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a category below to start learning. Each lesson is designed specifically for visual learning.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon
            const progressPercentage = calculateProgressPercentage(category.id)
            const completedLessons = userProgress[category.id] || 0

            return (
              <Card
                key={category.id}
                className="cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-blue-300"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${category.color} bg-opacity-10`}>
                      <IconComponent
                        className={`h-8 w-8 text-white`}
                        style={{ color: category.color.replace("bg-", "").replace("-500", "") }}
                      />
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {completedLessons}/{category.totalLessons}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{category.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{category.description}</p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-700">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${category.color}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                    {completedLessons > 0 ? "Continue Learning" : "Start Learning"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Your Learning Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(userProgress).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-sm text-gray-500">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(userProgress).filter((key) => userProgress[key] > 0).length}
              </div>
              <div className="text-sm text-gray-500">Categories Started</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-500">Current Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
