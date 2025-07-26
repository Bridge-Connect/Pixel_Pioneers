"use client"

import { GraduationCap, Palette, MessageSquare, Star, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import HeaderNavigation from "@/components/layout/HeaderNavigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"

const mainCategories = [
  {
    id: "academic",
    title: "Academic Subjects",
    icon: GraduationCap,
    emoji: "📚",
    color: "bg-blue-500",
  },
  {
    id: "life-skills",
    title: "Life Skills",
    icon: Palette,
    emoji: "🧠",
    color: "bg-green-500",
  },
  {
    id: "daily-conversations",
    title: "Daily Conversations",
    icon: MessageSquare,
    emoji: "💬",
    color: "bg-purple-500",
  },
  {
    id: "important-vocabulary",
    title: "Important Vocabulary",
    icon: Star,
    emoji: "⭐",
    color: "bg-orange-500",
  },
]

export default function MainDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white transition-colors duration-300">
      <HeaderNavigation user={user} />

      {/* Main Content */}
      <br></br>
      <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Learning</h2>
          <p className="text-gray-600">Choose a category to begin your journey</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-10xl mx-auto px-8">
          {mainCategories.map((category) => {
            return (
              <Link key={category.id} href={`/learning-path/category/${category.id}`}>
                <Card className="group cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg min-h-[350px]">
                  <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                    <div
                      className={`w-48 h-48 rounded-full flex items-center justify-center mx-auto mb-6 text-9xl ${category.color} group-hover:scale-110 transition-transform`}
                    >
                      <span>{category.emoji}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {category.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Progress Overview
        <div className="mt-16 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainCategories.map((category, index) => {
              const IconComponent = category.icon
              const progress = [75, 45, 60, 30][index] // Mock progress data
              return (
                <div key={category.id} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="w-full h-full rounded-full border-4 border-gray-200"></div>
                    <div
                      className={`absolute inset-0 rounded-full border-4 border-transparent ${category.color.split(" ")[0]} transition-all duration-500`}
                      style={{
                        background: `conic-gradient(currentColor ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
                        WebkitMask: "radial-gradient(circle at center, transparent 6px, black 6px)",
                        mask: "radial-gradient(circle at center, transparent 6px, black 6px)",
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{progress}%</div>
                </div>
              )
            })}
          </div>
        </div> */}
    </div>
  )
}
