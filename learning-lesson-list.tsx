"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../lib/firebase"
import { ArrowLeft, CheckCircle2, Play, Trophy, Target, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface LessonItem {
  id: string
  title: string
  isCompleted: boolean
  order: number
}

const lessonData: Record<string, Record<string, { title: string; items: LessonItem[] }>> = {
  "academic-subjects": {
    alphabets: {
      title: "Alphabets",
      items: Array.from({ length: 26 }, (_, i) => ({
        id: String.fromCharCode(65 + i),
        title: String.fromCharCode(65 + i),
        isCompleted: i < 5, // First 5 completed
        order: i + 1,
      })),
    },
    numbers: {
      title: "Numbers",
      items: Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        title: String(i + 1),
        isCompleted: false,
        order: i + 1,
      })),
    },
  },
}

export default function LearningLessonList() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.category as string
  const subCategoryId = params?.sub as string

  const lessonInfo = lessonData[categoryId]?.[subCategoryId]

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

  const handleLessonClick = (itemId: string) => {
    router.push(`/learning-path/${categoryId}/${subCategoryId}/${itemId}`)
  }

  const completedCount = lessonInfo?.items.filter((item) => item.isCompleted).length || 0
  const totalCount = lessonInfo?.items.length || 0
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleQuizClick = () => {
    router.push(`/learning-path/${categoryId}/${subCategoryId}/quiz`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lessonInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lessons Not Found</h2>
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
              onClick={() => router.push(`/learning-path/${categoryId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Topics</span>
            </Button>

            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">{lessonInfo.title}</h1>
            </div>

            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {completedCount}/{totalCount}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900">Your Progress</CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">{Math.ceil(totalCount * 2)} min total</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Lessons</span>
                <span className="font-medium text-gray-900">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{completedCount} completed</span>
                <span>{totalCount - completedCount} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose a Lesson to Practice</h2>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {lessonInfo.items.map((item) => (
              <Button
                key={item.id}
                variant={item.isCompleted ? "default" : "outline"}
                size="lg"
                className={`
                  aspect-square h-16 w-16 rounded-full text-lg font-bold transition-all duration-200
                  ${
                    item.isCompleted
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                      : "border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700"
                  }
                `}
                onClick={() => handleLessonClick(item.id)}
              >
                <div className="flex flex-col items-center justify-center">
                  {item.isCompleted && <CheckCircle2 className="h-3 w-3 mb-1" />}
                  <span className={item.isCompleted ? "text-xs" : "text-base"}>{item.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        {completedCount === totalCount && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Congratulations! 🎉</CardTitle>
                  <p className="text-sm text-gray-600">
                    You've completed all lessons. Take the quiz to test your knowledge!
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleQuizClick}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                size="lg"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Take the Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <Play className="h-8 w-8 text-blue-500 mb-2" />
              <p>
                <strong>1. Watch</strong>
                <br />
                See the visual demonstration
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Target className="h-8 w-8 text-green-500 mb-2" />
              <p>
                <strong>2. Practice</strong>
                <br />
                Try it yourself in the practice area
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-8 w-8 text-purple-500 mb-2" />
              <p>
                <strong>3. Complete</strong>
                <br />
                Mark as done and move to next
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
