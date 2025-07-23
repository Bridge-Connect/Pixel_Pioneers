"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"
import { MessageCircle, Users, Heart, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
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
      <Header user={user ?? undefined} title="Dashboard" />

      <main className="max-w-6xl mx-auto p-4">
        {/* Welcome Section */}
        <div className="text-center mb-12 mt-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our powerful tools designed to bridge communication gaps and create inclusive conversations.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Learning Path Card - NEW */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-purple-200">
            <div className="bg-purple-600 p-4 rounded-2xl w-fit mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Learning Path</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Interactive lessons and tutorials to learn sign language, vocabulary, and communication skills.
            </p>
            <Link href="/learning-path">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 py-3 text-base font-semibold">
                🎓 Start Learning
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-blue-200">
            <div className="bg-blue-600 p-4 rounded-2xl w-fit mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Live Chat</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Real-time communication tool with voice-to-text and text-to-speech capabilities for seamless
              conversations.
            </p>
            <Link href="/live-chat">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base font-semibold">
                💬 Start Chatting
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-green-200">
            <div className="bg-green-600 p-4 rounded-2xl w-fit mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Community</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Connect with others, share experiences, and get support from our inclusive community forum.
            </p>
            <Link href="/community">
              <Button className="w-full bg-green-600 hover:bg-green-700 py-3 text-base font-semibold">
                👥 Join Community
              </Button>
            </Link>
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
            <Link href="/learning-path">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <GraduationCap className="w-5 h-5 mr-2" />🎓 Start Learning
              </Button>
            </Link>
            <Link href="/live-chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-5 h-5 mr-2" />💬 Live Chat
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Users className="w-5 h-5 mr-2" />👥 Community
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
