"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TextToSpeechBoxProps {
  onSendMessage: (text: string) => void
  disabled?: boolean
}

export default function TextToSpeechBox({ onSendMessage, disabled }: TextToSpeechBoxProps) {
  const [inputText, setInputText] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speakText = (text: string) => {
    if (!window.speechSynthesis || !text.trim()) return

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  const handleSendMessage = () => {
    if (!inputText.trim() || disabled) return

    onSendMessage(inputText)
    speakText(inputText)
    setInputText("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <div className="flex-1">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="text-base py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
            disabled={disabled || isSpeaking}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || disabled || isSpeaking}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-200 transition-all duration-200"
          >
            {isSpeaking ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}>
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

      {isSpeaking && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            🔊 Speaking your message...
          </Badge>
        </motion.div>
      )}
    </div>
  )
}
