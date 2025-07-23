"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { UserIcon, Clock, Heart, ThumbsUp, MessageCircle, Flag, Play, Pause, Send } from "lucide-react"

interface Reply {
  id: string
  content: string
  createdAt: Date
  userId: string
}

interface PostData {
  id: string
  content: string
  imageUrl?: string
  videoUrl?: string
  createdAt: Date
  userId: string
  reactions: {
    likes: number
    hearts: number
  }
  replies?: Reply[]
}

interface CommunityPostCardProps {
  post: PostData
  onReply: (postId: string, content: string) => Promise<void>
  onReact: (postId: string, type: "like" | "heart") => Promise<void>
}

export default function CommunityPostCard({ post, onReply, onReact }: CommunityPostCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return

    setIsReplying(true)
    try {
      await onReply(post.id, replyContent.trim())
      setReplyContent("")
      setShowReplyForm(false)
    } catch (error) {
      console.error("Failed to reply:", error)
    } finally {
      setIsReplying(false)
    }
  }

  const toggleVideo = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const formatTimeAgo = (date: Date): string => {
    try {
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return "Just now"
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`

      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}h ago`

      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}d ago`

      return date.toLocaleDateString()
    } catch {
      return "Just now"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-6 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 rounded-full">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">👤 Anonymous User</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                ⏱️ {formatTimeAgo(post.createdAt)}
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
            <Flag className="w-4 h-4" />
          </Button>
        </div>

        {/* Post Content */}
        {post.content && <p className="text-gray-800 mb-4 leading-relaxed text-base">📝 {post.content}</p>}

        {/* Post Image */}
        {post.imageUrl && (
          <div className="mb-4">
            <img
              src={post.imageUrl || "/placeholder.svg"}
              alt="Post content"
              className="max-w-full h-auto rounded-lg shadow-sm max-h-96 mx-auto"
              loading="lazy"
            />
          </div>
        )}

        {/* Post Video */}
        {post.videoUrl && (
          <div className="mb-4 relative">
            <video
              ref={videoRef}
              src={post.videoUrl}
              className="max-w-full h-auto rounded-lg shadow-sm max-h-96 mx-auto"
              onEnded={() => setIsPlaying(false)}
              controls={false}
            />
            <Button
              onClick={toggleVideo}
              className="absolute inset-0 bg-black/20 hover:bg-black/30 text-white rounded-lg"
              variant="ghost"
            >
              {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12" />}
            </Button>
          </div>
        )}

        {/* Reactions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => onReact(post.id, "like")}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />👍 <span className="text-sm ml-1">{post.reactions?.likes || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-500"
              onClick={() => onReact(post.id, "heart")}
            >
              <Heart className="w-4 h-4 mr-2" />
              ❤️ <span className="text-sm ml-1">{post.reactions?.hearts || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-green-600"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />💬 Reply ({post.replies?.length || 0})
            </Button>
          </div>

          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Community Post
          </Badge>
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="space-y-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="💬 Write a reply..."
                  className="min-h-[80px] text-sm border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                  maxLength={300}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{replyContent.length}/300</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowReplyForm(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReplySubmit}
                      disabled={!replyContent.trim() || isReplying}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isReplying ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Replying...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 mr-2" />
                          Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replies */}
        {post.replies && post.replies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />💬 Replies ({post.replies.length})
            </h4>
            <div className="space-y-3">
              {post.replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-gradient-to-r from-blue-400 to-teal-400 p-1 rounded-full">
                      <UserIcon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">👤 Anonymous</span>
                    <span className="text-xs text-gray-500">⏱️ {formatTimeAgo(reply.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">💬 {reply.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
