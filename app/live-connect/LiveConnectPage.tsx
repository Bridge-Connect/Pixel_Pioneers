"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import AuthGuard from "@/components/AuthGuard"
import HomeNavIcon from "@/components/HomeNavIcon"
import MicToTextButton from "@/components/MicToTextButton"
import TextToSpeechBox from "@/components/TextToSpeechBox"

interface Message {
  id: string
  text: string
  type: "sent" | "received"
  timestamp: Date
}

export default function LiveConnectPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addMessage = (text: string, type: "sent" | "received") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleVoiceTranscript = (text: string) => {
    addMessage(text, "received")
  }

  const handleSendMessage = (text: string) => {
    addMessage(text, "sent")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Live Connect</h1>
                <p className="text-sm text-gray-600">Real-Time Communication</p>
              </div>
            </div>
            <HomeNavIcon />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-4 pb-32">
          {/* Instructions */}
          <Card className="mb-6 p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">How to Use Live Connect</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-2xl">🎤</span>
                <div>
                  <p className="font-medium">For Hearing Users:</p>
                  <p>Click the microphone to speak. Your voice will be converted to text.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-2xl">💬</span>
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
              <MicToTextButton onTranscript={handleVoiceTranscript} />
            </div>
          </Card>

          {/* Chat Messages */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Conversation</h3>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Start a conversation by speaking or typing a message</p>
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
                            ? "bg-green-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.type === "sent" ? "text-green-100" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
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
          <div className="max-w-6xl mx-auto p-4">
            <TextToSpeechBox onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
