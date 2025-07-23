"use client"

import type * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "destructive" | "warning" | "info"
  duration?: number
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after duration
    setTimeout(() => {
      dismiss(id)
    }, toast.duration || 5000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getIcon = (variant: Toast["variant"]) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "destructive":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getVariantStyles = (variant: Toast["variant"]) => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "destructive":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-white border-gray-200 text-gray-800"
    }
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className={cn("max-w-sm w-full shadow-lg rounded-lg border p-4", getVariantStyles(toast.variant))}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">{getIcon(toast.variant)}</div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium">{toast.title}</p>
                  {toast.description && <p className="mt-1 text-sm opacity-90">{toast.description}</p>}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
