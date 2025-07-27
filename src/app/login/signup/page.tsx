"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../../../lib/firebase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, UserPlus, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false)
      if (user) {
        router.push("/dashboard-home")
      }
    })

    return () => unsubscribe()
  }, [router])

  const createUserProfile = async (userId: string, email: string) => {
    try {
      const userRef = doc(db, "users", userId)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email,
          createdAt: new Date(),
          lastLogin: new Date(),
          profile: {
            preferences: {
              theme: "light",
              notifications: true,
            },
          },
          stats: {
            totalSessions: 0,
            totalMessages: 0,
          },
        })
      }
    } catch (error) {
      console.error("Error creating user profile:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) {
      setError("Authentication service is not available")
      return
    }



    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    setError("")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await createUserProfile(userCredential.user.uid, email)
      router.push("/dashboard-home")
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 rounded-2xl w-fit mx-auto mb-4">
            <span className="text-4xl">🤝</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join EduSign</h1>
          <p className="text-gray-600">Create your account</p>
          <p className="text-sm text-gray-500 mt-2">Start your journey to inclusive communication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-3 rounded-xl text-base font-semibold transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Already have an account? Sign in
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">Building bridges for inclusive communication</p>
        </div>
      </Card>
    </div>
  )
} 