"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase-client"
import { Card } from "@/components/ui/card-component"
import { Button } from "@/components/ui/button-component"
import { Badge } from "@/components/ui/badge-component"
import { MessageCircle, BookOpen, Users, Search, ArrowRight, Sparkles, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import AuthGuardComponent from "@/components/auth/AuthGuardComponent"
import HeaderNavigation from "@/components/layout/HeaderNavigation"

interface UserProfile {
  email: string
  createdAt: any
  lastLogin: any
  profile: {
    displayName: string
    preferences: {
      theme: string
      notifications: boolean
    }
  }
  stats: {
    totalSessions: number
    totalMessages: number
  }
}

export default function DashboardHomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)

        // Fetch user profile from Firestore
        try {
          const userRef = doc(db, "users", user.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile)

            // Update last login and session count
            await updateDoc(userRef, {
              lastLogin: new Date(),
              "stats.totalSessions": (userSnap.data().stats?.totalSessions || 0) + 1,
            })
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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

  return (
    <AuthGuardComponent>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white">
        <HeaderNavigation user={user} />

        <main className="max-w-6xl mx-auto p-4">
          {/* Welcome Section */}
          <div className="text-center mb-12 mt-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 mb-6 px-6 py-2 text-lg font-semibold shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Welcome Back!
              </Badge>

              <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
                Let's continue your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  journey
                </span>
              </h1>

              {/* User greeting with sign language emojis */}
              <div className="flex justify-center space-x-4 text-4xl lg:text-5xl mb-8">
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0 }}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  👋
                </motion.span>
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  {userProfile?.profile?.displayName || user?.email?.split("@")[0] || "Friend"}
                </motion.span>
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.6 }}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  ❤️
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {/* Learning Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Link href="/dashboard-home">
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-blue-300 cursor-pointer group">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-3xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">📘 Learning</h3>
                  <h4 className="text-lg font-medium text-gray-800">Platform</h4>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 mt-3">
                    <Zap className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </Card>
              </Link>
            </motion.div>

            {/* Dictionary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-teal-300 cursor-pointer group opacity-75">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-6 rounded-3xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Search className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🧠 Dictionary</h3>
                <h4 className="text-lg font-medium text-gray-600">Coming Soon</h4>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 mt-3">
                  Soon
                </Badge>
              </Card>
            </motion.div>

            {/* Live Communication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link href="/live-communication">
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-green-300 cursor-pointer group">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-3xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">🗣️ Live</h3>
                  <h4 className="text-lg font-medium text-gray-800">Communication</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 mt-3">
                    <Zap className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </Card>
              </Link>
            </motion.div>

            {/* Community Forum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/community-space">
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-purple-300 cursor-pointer group">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-3xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">💬 Community</h3>
                  <h4 className="text-lg font-medium text-gray-800">Forum</h4>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 mt-3">
                    <Zap className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </Card>
              </Link>
            </motion.div>
          </div>

          {/* Quick Start Section */}
          <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-2xl mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Communicate?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Start a conversation right now with our live communication tool
              </p>

              <Link href="/live-communication">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Start Chatting Now
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual Communication Showcase */}
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">Your Communication Tools</h2>

              {/* Interactive Communication Flow */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="text-5xl mb-4">👂</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Listen</h3>
                  <p className="text-gray-600 text-sm">Voice input</p>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="text-5xl mb-4">⚡</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Convert</h3>
                  <p className="text-gray-600 text-sm">Real-time processing</p>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Read</h3>
                  <p className="text-gray-600 text-sm">Text output</p>
                </Card>
              </div>

              {/* Sign Language Emojis */}
              <div className="flex justify-center space-x-4 text-4xl mb-8">
                {["🤟", "👋", "🤝", "👍", "❤️"].map((emoji, index) => (
                  <motion.span
                    key={index}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: index * 0.2 }}
                    className="hover:scale-110 transition-transform cursor-pointer bg-white rounded-full p-3 shadow-lg"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </AuthGuardComponent>
  )
}
