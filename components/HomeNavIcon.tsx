"use client"

import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomeNavIcon() {
  return (
    <Link href="/learning-path">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Button>
    </Link>
  )
}
