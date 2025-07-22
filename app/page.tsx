"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, BookOpen, Users, Search, ArrowRight, LogIn, Heart, Sparkles } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/learning-paths")
      }
    })

    return () => unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-xl shadow-lg">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Bridge Connect</h1>
                <p></p>
              </div>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-2 rounded-xl shadow-lg">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Free Badge */}
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 mb-8 px-6 py-2 text-lg font-semibold shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              100% Free Forever
            </Badge>

            {/* Main Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-8 leading-tight">
              {/* Bridge Connect –{" "} */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Empowering Deaf and Mute Individuals
              </span>
            </h1>

            {/* Sign Language Visual */}
            <div className="flex justify-center space-x-4 lg:space-x-8 text-5xl lg:text-7xl mb-12">
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0 }}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                🤟
              </motion.span>
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                👋
              </motion.span>
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.6 }}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                🤝
              </motion.span>
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.9 }}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                ❤️
              </motion.span>
            </div>

            {/* Start Button */}
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-12 py-4 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What We Offer - 4 Features Grid */}
      <section className="py-16 bg-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">What We Offer</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Learning Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Link href="/learning-paths">
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-blue-300 cursor-pointer group">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-3xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">📘 Learning</h3>
                  <h4 className="text-lg font-medium text-gray-800">Platform</h4>
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
                </Card>
              </Link>
            </motion.div>

            {/* Community Forum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/community">
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-purple-300 cursor-pointer group opacity-75">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-3xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">💬 Community</h3>
                  <h4 className="text-lg font-medium text-gray-600">Coming Soon</h4>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Communication Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 via-teal-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Communication Without Barriers</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Built specifically for the deaf and mute community. Always free, always accessible.
            </p>

            {/* Communication Flow Visual */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-4">👂</div>
                <h3 className="text-lg font-semibold mb-2">Voice Input</h3>
                <p className="text-blue-100 text-sm">Speak naturally</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2">Real-time</h3>
                <p className="text-blue-100 text-sm">Instant conversion</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">Text Output</h3>
                <p className="text-blue-100 text-sm">Read & respond</p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sign Language Showcase */}
      <section className="py-16 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8">Every Gesture Matters</h2>

            {/* Interactive Sign Language Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 lg:gap-6 mb-8">
              {[
                { emoji: "🤟", label: "I Love You" },
                { emoji: "👋", label: "Hello" },
                { emoji: "🤝", label: "Nice to Meet" },
                { emoji: "👍", label: "Good" },
                { emoji: "🙏", label: "Thank You" },
                { emoji: "❤️", label: "Love" },
              ].map((sign, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="text-4xl lg:text-5xl mb-3">{sign.emoji}</div>
                  <p className="text-sm font-medium text-gray-700">{sign.label}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bridge Connect celebrates all forms of communication and makes them accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2025 Bridge Connect</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                💼
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
