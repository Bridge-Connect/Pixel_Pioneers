"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../lib/firebase"
import { ArrowLeft, Lock, CheckCircle2, Play, BookOpen, Clock, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface SubCategory {
  id: string
  title: string
  description: string
  totalItems: number
  completedItems: number
  isUnlocked: boolean
  estimatedTime: string
  difficulty: "Easy" | "Medium" | "Hard"
}

const categoryData: Record<string, { title: string; subCategories: SubCategory[] }> = {
  "academic-subjects": {
    title: "Academic Subjects",
    subCategories: [
      {
        id: "alphabets",
        title: "Alphabets",
        description: "Learn A to Z with visual aids",
        totalItems: 26,
        completedItems: 5,
        isUnlocked: true,
        estimatedTime: "30 min",
        difficulty: "Easy",
      },
      {
        id: "numbers",
        title: "Numbers",
        description: "Count from 1 to 100",
        totalItems: 20,
        completedItems: 0,
        isUnlocked: false,
        estimatedTime: "25 min",
        difficulty: "Easy",
      },
      {
        id: "colors",
        title: "Colors",
        description: "Identify different colors",
        totalItems: 15,
        completedItems: 0,
        isUnlocked: false,
        estimatedTime: "20 min",
        difficulty: "Easy",
      },
      {
        id: "shapes",
        title: "Shapes",
        description: "Basic geometric shapes",
        totalItems: 12,
        completedItems: 0,
        isUnlocked: false,
        estimatedTime: "15 min",
        difficulty: "Medium",
      },
    ],
  },
  "life-skills": {
    title: "Life Skills",
    subCategories: [
      {
        id: "daily-routine",
        title: "Daily Routine",
        description: "Morning to night activities",
        totalItems: 15,
        completedItems: 2,
        isUnlocked: true,
        estimatedTime: "40 min",
        difficulty: "Easy",
      },
      {
        id: "cooking-basics",
        title: "Cooking Basics",
        description: "Simple cooking steps",
        totalItems: 18,
        completedItems: 0,
        isUnlocked: false,
        estimatedTime: "45 min",
        difficulty: "Medium",
      },
    ],
  },
}

export default function LearningCategoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.category as string

  const categoryInfo = categoryData[categoryId]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleSubCategoryClick = (subCategoryId: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      router.push(`/learning-path/${categoryId}/${subCategoryId}`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <Button onClick={() => router.push("/learning-path")}>Back to Learning Path</Button>
        </div>
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
              onClick={() => router.push("/learning-path")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Categories</span>
            </Button>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">{categoryInfo.title}</h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Topic to Start Learning</h2>
          <p className="text-gray-600">Complete lessons in order to unlock new topics</p>
        </div>

        {/* Sub-categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryInfo.subCategories.map((subCategory, index) => {
            const progressPercentage = Math.round((subCategory.completedItems / subCategory.totalItems) * 100)
            const isCompleted = subCategory.completedItems === subCategory.totalItems

            return (
              <Card
                key={subCategory.id}
                className={`transform transition-all duration-200 ${
                  subCategory.isUnlocked
                    ? "cursor-pointer hover:scale-105 hover:shadow-lg border-2 hover:border-blue-300"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => handleSubCategoryClick(subCategory.id, subCategory.isUnlocked)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!subCategory.isUnlocked ? (
                        <div className="p-2 rounded-full bg-gray-200">
                          <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                      ) : isCompleted ? (
                        <div className="p-2 rounded-full bg-green-100">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-blue-100">
                          <Play className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{subCategory.title}</CardTitle>
                        <Badge variant="secondary" className={`text-xs ${getDifficultyColor(subCategory.difficulty)}`}>
                          {subCategory.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <Clock className="h-3 w-3" />
                        {subCategory.estimatedTime}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {subCategory.completedItems}/{subCategory.totalItems}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">{subCategory.description}</p>

                  {/* Progress Bar */}
                  {subCategory.isUnlocked && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-700">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className={`w-full mt-4 ${
                      subCategory.isUnlocked
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    size="lg"
                    disabled={!subCategory.isUnlocked}
                  >
                    {!subCategory.isUnlocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : subCategory.completedItems > 0 ? (
                      "Continue Learning"
                    ) : (
                      "Start Learning"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Unlock Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Unlock New Topics</h3>
          <p className="text-gray-600 text-sm">
            Complete all lessons in the current topic to unlock the next one. This helps you build knowledge step by
            step!
          </p>
        </div>
      </div>
    </div>
  )
}
