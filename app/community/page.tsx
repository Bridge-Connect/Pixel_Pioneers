"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Heart, Star, Calendar, TrendingUp, Plus, Search } from "lucide-react"
import AuthGuard from "@/components/AuthGuard"
import Header from "@/components/Header"

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
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
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header user={user} title="Community Forum" subtitle="Connect & Share" />

        <main className="max-w-7xl mx-auto p-4">
          {/* Coming Soon Hero */}
          <div className="text-center mb-12 mt-8">
            <div className="bg-purple-600 p-6 rounded-3xl w-fit mx-auto mb-6">
              <Users className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Community Forum</h2>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              A safe space for deaf, mute, and hearing individuals to connect, share experiences, and support each other
              in their communication journey.
            </p>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 px-6 py-2 text-lg">
              <Star className="w-4 h-4 mr-2" />
              Coming Soon
            </Badge>
          </div>

          {/* Planned Features */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-white/80 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Planned Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Discussion Forums</h4>
                    <p className="text-sm text-gray-600">
                      Topic-based discussions on accessibility, communication tips, and experiences
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Support Groups</h4>
                    <p className="text-sm text-gray-600">
                      Peer support groups for sharing challenges and celebrating achievements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Events & Meetups</h4>
                    <p className="text-sm text-gray-600">Virtual and local events to bring the community together</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Resource Sharing</h4>
                    <p className="text-sm text-gray-600">Share helpful resources, tools, and learning materials</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white/80 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Community Guidelines</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">🤝 Respect & Inclusion</h4>
                  <p className="text-sm text-blue-700">
                    Everyone is welcome regardless of hearing ability, communication method, or background
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">💬 Accessible Communication</h4>
                  <p className="text-sm text-green-700">
                    Use clear language, provide context, and be patient with different communication styles
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">🛡️ Safe Space</h4>
                  <p className="text-sm text-purple-700">
                    Zero tolerance for discrimination, harassment, or inappropriate behavior
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">📚 Constructive Sharing</h4>
                  <p className="text-sm text-orange-700">
                    Share experiences, ask questions, and help others learn and grow
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview of Forum Layout */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Forum Preview</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sample Forum Categories */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">💬 General Discussion</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      24
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-600">Open discussions about anything and everything</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">🎯 Communication Tips</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      18
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600">Share and learn communication strategies</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-purple-800">🤝 Support & Encouragement</h4>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      31
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-600">Get and give support to community members</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-orange-800">📚 Resources & Tools</h4>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      12
                    </Badge>
                  </div>
                  <p className="text-sm text-orange-600">Share helpful apps, tools, and resources</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-800">🎉 Success Stories</h4>
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      9
                    </Badge>
                  </div>
                  <p className="text-sm text-red-600">Celebrate achievements and milestones</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">❓ Q&A</h4>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      15
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Ask questions and get answers from the community</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Stay Connected</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              While we're building the community forum, you can still connect with others through our Live Communication
              tool. Join conversations and start building meaningful connections today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/live-communication">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Live Communication
                </a>
              </Button>
              <Button size="lg" variant="outline" disabled>
                <Users className="w-5 h-5 mr-2" />
                Join Community (Coming Soon)
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
