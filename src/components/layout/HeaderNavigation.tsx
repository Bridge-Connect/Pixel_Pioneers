"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button-component"
import { Home, LogOut, UserIcon, Menu, X, MessageCircle, BookOpen, Users, Search, Mic } from "lucide-react"
import Link from "next/link"

interface HeaderNavigationProps {
  user?: User | null
  title?: string
  subtitle?: string
}

export default function HeaderNavigation({
  user,
  title = "EduSign",
  subtitle = "Breaking Communication Barriers",
}: HeaderNavigationProps) {
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

  const navigationItems = [
    {
      icon: BookOpen,
      label: "Learning",
      href: "/learning-path",
      emoji: "📚",
    },
    {
      icon: Mic,
      label: "Quick Connect",
      href: "/live-communication",
      emoji: "🎙️",
    },
    {
      icon: Search,
      label: "Dictionary",
      href: "/dictionary",
      emoji: "📖",
      disabled: false,
    },
    {
      icon: Users,
      label: "Community",
      href: "/community-space",
      emoji: "🧑‍🤝‍🧑",
    },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/dashboard-home" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
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
            <nav className="flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.disabled ? "#" : item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto ${
                      item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
                    }`}
                    disabled={item.disabled}
                    title={item.disabled ? "Coming Soon" : item.label}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                    {/* {item.comingSoon && <span className="text-xs text-gray-500">Coming Soon</span>} */}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="h-8 w-px bg-gray-300"></div>

            {/* Home Button */}
            <Link href="/dashboard-home">
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
            <div className="grid grid-cols-2 gap-3 mb-4">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.disabled ? "#" : item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full flex flex-col items-center space-y-2 py-4 h-auto ${
                      item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
                    }`}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && setMobileMenuOpen(false)}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {/* {item.comingSoon && <span className="text-xs text-gray-500">Coming Soon</span>} */}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3">
              <Link href="/dashboard-home">
                <Button
                  variant="outline"
                  className="w-full justify-start mb-3 bg-transparent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="text-2xl mr-2" />🏠 Home Dashboard
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
        )}
      </div>
    </header>
  )
}
