"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"
import { Home, LogOut, UserIcon, Menu, X, MessageCircle, BookOpen, Users } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  user?: User | null
  title?: string
  subtitle?: string
}

export default function Header({
  user,
  title = "Bridge Connect",
  subtitle = "Breaking Communication Barriers",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    if (!auth) return

    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/learning-paths" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-600 hidden sm:block">{subtitle}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <Link href="/learning-paths">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Learning</span>
                </Button>
              </Link>
              <Link href="/live-communication">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Live Chat</span>
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                </Button>
              </Link>
            </nav>

            <div className="h-6 w-px bg-gray-300"></div>

            <Link href="/learning-paths">
              <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>

            {user && (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <UserIcon className="w-4 h-4" />
                  <span className="max-w-32 truncate">{user.email}</span>
                </div>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="outline" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/learning-paths">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learning Platform
                </Button>
              </Link>
              <Link href="/live-communication">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Communication
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Community Forum
                </Button>
              </Link>

              <div className="border-t border-gray-200 pt-3">
                <Link href="/learning-paths">
                  <Button variant="outline" className="w-full justify-start mb-3 bg-transparent">
                    <Home className="w-4 h-4 mr-2" />
                    Home Dashboard
                  </Button>
                </Link>

                {user && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg mb-3">
                      <UserIcon className="w-4 h-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <Button onClick={handleSignOut} variant="outline" className="w-full justify-start bg-transparent">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
