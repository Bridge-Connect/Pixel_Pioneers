"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MicToTextButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export default function MicToTextButton({ onTranscript, disabled }: MicToTextButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onstart = () => {
      setIsListening(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript])

  const startListening = () => {
    if (!isSupported || !recognitionRef.current || disabled) return

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

  if (!isSupported) {
    return (
      <div className="text-center">
        <Button disabled className="w-20 h-20 rounded-full">
          <Mic className="w-8 h-8" />
        </Button>
        <p className="text-sm text-red-500 mt-2">Speech recognition not supported</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={disabled}
          className={`w-20 h-20 rounded-full text-white text-lg font-semibold transition-all duration-300 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
          }`}
        >
          <motion.div
            animate={isListening ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: isListening ? Number.POSITIVE_INFINITY : 0, duration: 1.5 }}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </motion.div>
        </Button>
      </motion.div>

      {isListening && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <Badge variant="secondary" className="bg-red-100 text-red-700 px-4 py-2">
            🎤 Listening... Speak now
          </Badge>
        </motion.div>
      )}
    </div>
  )
}
