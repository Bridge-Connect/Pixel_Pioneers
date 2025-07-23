"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../lib/firebase"
import { ArrowLeft, CheckCircle, Play, Pause, Volume2, VolumeX, Brush, RotateCcw, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

export default function LearningLessonDetail() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()
  const params = useParams()

  const categoryId = params?.category as string
  const subCategoryId = params?.sub as string
  const itemId = params?.item as string

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Load completion status from Firebase
        loadCompletionStatus(currentUser.uid)
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadCompletionStatus = async (userId: string) => {
    // In real implementation, fetch from Firestore
    // For demo, simulate some completed items
    const completedItems = ["A", "B", "C", "D", "E"]
    setIsCompleted(completedItems.includes(itemId))
  }

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying)
  }

  const handleSoundToggle = () => {
    setIsSoundOn(!isSoundOn)
  }

  const handleMarkComplete = async () => {
    if (user) {
      // In real implementation, save to Firestore
      setIsCompleted(true)

      // Show success message and redirect after delay
      setTimeout(() => {
        router.push(`/learning-path/${categoryId}/${subCategoryId}`)
      }, 1500)
    }
  }

  const handleNextLesson = () => {
    // Logic to go to next lesson
    const nextLetter = String.fromCharCode(itemId.charCodeAt(0) + 1)
    if (nextLetter <= "Z") {
      router.push(`/learning-path/${categoryId}/${subCategoryId}/${nextLetter}`)
    } else {
      router.push(`/learning-path/${categoryId}/${subCategoryId}`)
    }
  }

  const clearPracticeArea = () => {
    // In real implementation, clear the canvas
    console.log("Clearing practice area")
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
              onClick={() => router.push(`/learning-path/${categoryId}/${subCategoryId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Lessons</span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                {itemId}
              </div>
              <h1 className="text-xl font-bold text-gray-900">Letter {itemId}</h1>
            </div>

            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className={isCompleted ? "bg-green-500 text-white" : ""}
            >
              {isCompleted ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Letter Display Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900">Learn the Letter "{itemId}"</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-9xl font-bold text-blue-600 mb-6 select-none">{itemId}</div>
              <div className="text-6xl font-bold text-gray-400 mb-4 select-none">{itemId.toLowerCase()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Video Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900">Watch & Learn</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSoundToggle}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {isSoundOn ? "Sound On" : "Sound Off"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              {/* Video Placeholder */}
              <div className="text-center text-white">
                <div className="mb-4">
                  {isVideoPlaying ? <Pause className="h-16 w-16 mx-auto" /> : <Play className="h-16 w-16 mx-auto" />}
                </div>
                <p className="text-lg mb-4">{isVideoPlaying ? "Playing..." : "Click to play video demonstration"}</p>
                <Button onClick={handleVideoToggle} className="bg-blue-600 hover:bg-blue-700">
                  {isVideoPlaying ? "Pause Video" : "Play Video"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900">Practice Writing</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearPracticeArea}
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white min-h-[300px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Brush className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Practice Here</p>
                <p className="text-sm">Use your finger or stylus to trace the letter "{itemId}"</p>
                <div className="mt-6 text-8xl font-bold text-gray-200 select-none">{itemId}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!isCompleted ? (
            <Button
              onClick={handleMarkComplete}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Complete
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                onClick={handleNextLesson}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                size="lg"
              >
                Next Lesson
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                onClick={() => router.push(`/learning-path/${categoryId}/${subCategoryId}`)}
                variant="outline"
                className="flex-1 py-3"
                size="lg"
              >
                Back to Lessons
              </Button>
            </div>
          )}
        </div>

        {/* Success Message */}
        {isCompleted && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Great Job! 🎉</h3>
                <p className="text-green-700">
                  You've successfully completed the letter "{itemId}". Keep up the excellent work!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
