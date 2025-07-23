"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { collection, addDoc, query, orderBy, onSnapshot, limit, serverTimestamp } from "firebase/firestore"
import { auth as firebaseAuth } from "@/lib/firebase-client"
import { getFirestore } from "firebase/firestore"
import { firebaseApp } from "@/lib/firebase-client"

const firestoreDb = getFirestore(firebaseApp)
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Send, Volume2, MessageCircle, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button-component"
import { Input } from "@/components/ui/input-component"
import { Card } from "@/components/ui/card-component"
import { Badge } from "@/components/ui/badge-component"
import AuthGuardComponent from "@/components/auth/AuthGuardComponent"
import HeaderNavigation from "@/components/layout/HeaderNavigation"

interface Message {
  id: string
  text: string
  type: "sent" | "received"
  timestamp: Date
  userId?: string
  userEmail?: string
}

export default function LiveCommunicationPage() {
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [listeningAnimation, setListeningAnimation] = useState(false)

  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!firebaseAuth) return

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUser(user)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user || !firestoreDb) {
      console.log("⏳ Waiting for user and database...")
      return
    }

    console.log("📡 Setting up messages listener...")

    try {
      const messagesRef = collection(firestoreDb, "liveChatMessages")
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(50))

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log("📊 Messages snapshot received:", snapshot.docs.length, "messages")

          const firestoreMessages = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date(),
            }
          }) as Message[]

          // Reverse to show oldest first
          setMessages(firestoreMessages.reverse())
          console.log("✅ Messages updated successfully")
        },
        (error) => {
          console.error("❌ Messages listener error:", error)
        },
      )

      return () => {
        console.log("🔌 Cleaning up messages listener")
        unsubscribe()
      }
    } catch (error) {
      console.error("❌ Error setting up messages listener:", error)
    }
  }, [user])

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition || !window.speechSynthesis) {
      setIsSupported(false)
      return
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setListeningAnimation(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      addMessage(transcript, "received")
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      setListeningAnimation(false)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
      setListeningAnimation(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (currentUtteranceRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addMessage = async (text: string, type: "sent" | "received") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date(),
      userId: user?.uid,
      userEmail: user?.email ?? undefined,
    }

    // Add to local state immediately for better UX
    setMessages((prev) => [...prev, newMessage])

    // Save to Firestore
    if (user) {
      try {
        await addDoc(collection(firestoreDb, "liveChatMessages"), {
          text,
          type,
          timestamp: serverTimestamp(),
          userId: user.uid,
          userEmail: user.email,
          sessionId: `${user.uid}-${new Date().toDateString()}`, // Daily session
        })
      } catch (error) {
        console.error("Error saving message:", error)
      }
    }
  }

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const speakText = (text: string) => {
    if (!window.speechSynthesis || !text.trim()) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1

    currentUtteranceRef.current = utterance

    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    window.speechSynthesis.speak(utterance)
  }

  const pauseResumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    } else {
      window.speechSynthesis.pause()
    }
  }

  const stopSpeech = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    currentUtteranceRef.current = null
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    addMessage(inputText, "sent")
    speakText(inputText)
    setInputText("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isSupported) {
    return (
      <AuthGuardComponent>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <HeaderNavigation user={user} title="Live Communication" subtitle="Real-time Speech & Text" />
          <div className="flex items-center justify-center p-4 mt-20">
            <Card className="p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Browser Not Supported</h2>
              <p className="text-gray-600 mb-6">
                Your browser doesn't support the required speech APIs. Please use a modern browser like Chrome, Edge, or
                Safari.
              </p>
            </Card>
          </div>
        </div>
      </AuthGuardComponent>
    )
  }

  return (
    <AuthGuardComponent>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <HeaderNavigation user={user} title="Live Communication" subtitle="Real-time Speech & Text" />

        {/* Main Content */}
        <main className="max-w-5xl mx-auto p-4 pb-32">
          {/* Instructions */}
          <Card className="mb-6 p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">How to Use Live Communication</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <Mic className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">For Hearing Users:</p>
                  <p>Click the microphone to speak. Your voice will be converted to text instantly.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Volume2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">For Deaf/Mute Users:</p>
                  <p>Type your message and click "Send & Speak" to convert text to speech.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Voice Input Section */}
          <Card className="mb-6 p-6 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Voice Input</h3>
              <div className="flex justify-center items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isSpeaking}
                    className={`w-20 h-20 rounded-full text-white text-lg font-semibold transition-all duration-300 ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                        : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    }`}
                  >
                    <motion.div
                      animate={listeningAnimation ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </motion.div>
                  </Button>
                </motion.div>

                {isSpeaking && (
                  <div className="flex space-x-2">
                    <Button onClick={pauseResumeSpeech} variant="outline" size="sm">
                      {window.speechSynthesis?.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </Button>
                    <Button onClick={stopSpeech} variant="outline" size="sm">
                      Stop
                    </Button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4"
                  >
                    <Badge variant="secondary" className="bg-red-100 text-red-700 px-4 py-2">
                      🎤 Listening... Speak now
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Chat Messages */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Live Conversation</h3>
              <p className="text-sm text-gray-600">Messages are saved for this session</p>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Start a conversation by speaking or typing a message</p>
                    <p className="text-sm mt-2">Your messages will appear here in real-time</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                          message.type === "sent"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${message.type === "sent" ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          {message.type === "received" && (
                            <Button
                              onClick={() => speakText(message.text)}
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </Card>
        </main>

        {/* Text Input - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-5xl mx-auto p-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="text-base py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  disabled={isSpeaking}
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isSpeaking}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-200 transition-all duration-200"
                >
                  {isSpeaking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                    >
                      <Volume2 className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Send & Speak</span>
                      <span className="sm:hidden">Send</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </div>

            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-center"
                >
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    🔊 Speaking your message...
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AuthGuardComponent>
  )
}
