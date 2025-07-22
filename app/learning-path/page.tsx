"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, UserIcon, MessageCircle, BookOpen, Users, Heart } from "lucide-react"
import Link from "next/link"

export default function LearningPathPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      router.push("/login")
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      if (user) {
        setUser(user)
      } else {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    if (!auth) return

    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bridge Connect</h1>
              <p className="text-sm text-gray-600">Breaking Communication Barriers</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Welcome,</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Welcome Section */}
        <div className="text-center mb-12 mt-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our powerful tools designed to bridge communication gaps and create inclusive conversations.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-blue-200">
            <div className="bg-blue-600 p-4 rounded-2xl w-fit mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Live Connect</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Real-time communication tool with voice-to-text and text-to-speech capabilities for seamless
              conversations.
            </p>
            <Link href="/live-connect">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base font-semibold">
                Start Communicating
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-green-200 opacity-75">
            <div className="bg-green-600 p-4 rounded-2xl w-fit mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Learning Paths</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Interactive tutorials and lessons to learn sign language and improve communication skills.
            </p>
            <Button disabled className="w-full py-3 text-base font-semibold">
              Coming Soon
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-purple-200 opacity-75">
            <div className="bg-purple-600 p-4 rounded-2xl w-fit mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Community Forum</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Connect with others, share experiences, and get support from our inclusive community.
            </p>
            <Button disabled className="w-full py-3 text-base font-semibold">
              Coming Soon
            </Button>
          </Card>
        </div>

        {/* User Stats */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-red-300" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Making Communication Accessible</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Accessible Design</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Real-time</div>
                <div className="text-blue-100">Communication</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Free</div>
                <div className="text-blue-100">For Everyone</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/live-connect">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Live Connect
              </Button>
            </Link>
            <Button size="lg" variant="outline" disabled>
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Lessons
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
