"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  limit,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "@/lib/firebase-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Plus,
  ImageIcon,
  Video,
  Send,
  X,
  Eye,
  Loader2,
  UserIcon,
  Clock,
  Heart,
  ThumbsUp,
  MessageCircle,
  Flag,
  Play,
  Pause,
} from "lucide-react"
import AuthGuard from "@/components/AuthGuard"
import Header from "@/components/Header"

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

interface Reply {
  id: string
  content: string
  createdAt: Date
  userId: string
}

// Community Post Component
function CommunityPostItem({
  post,
  onReply,
  onReact,
}: {
  post: PostData
  onReply: (postId: string, content: string) => Promise<void>
  onReact: (postId: string, type: "like" | "heart") => Promise<void>
}) {
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

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showNewPost, setShowNewPost] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const postsContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initialize auth listener
  useEffect(() => {
    console.log("🔥 Initializing Firebase Auth...")

    if (!auth) {
      console.error("❌ Firebase Auth not initialized")
      toast({
        title: "Error",
        description: "Firebase Auth not available",
        variant: "destructive",
      })
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👤 Auth state changed:", user ? `User: ${user.uid}` : "No user")
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [toast])

  // Initialize posts listener
  useEffect(() => {
    if (!user || !db) {
      console.log("⏳ Waiting for user and database...")
      return
    }

    console.log("📡 Setting up posts listener...")

    try {
      const postsRef = collection(db, "communityPosts")
      const q = query(postsRef, orderBy("createdAt", "desc"), limit(50))

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log("📊 Posts snapshot received:", snapshot.docs.length, "posts")

          const firestorePosts = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
            }
          }) as PostData[]

          setPosts(firestorePosts)
          console.log("✅ Posts updated successfully")
        },
        (error) => {
          console.error("❌ Posts listener error:", error)
          toast({
            title: "Error",
            description: "Failed to load posts",
            variant: "destructive",
          })
        },
      )

      return () => {
        console.log("🔌 Cleaning up posts listener")
        unsubscribe()
      }
    } catch (error) {
      console.error("❌ Error setting up posts listener:", error)
      toast({
        title: "Error",
        description: "Database connection failed",
        variant: "destructive",
      })
    }
  }, [user, toast])

  const validateFile = (file: File, type: "image" | "video"): boolean => {
    console.log(`📁 Validating ${type}:`, {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      type: file.type,
    })

    const maxSize = type === "image" ? 5 * 1024 * 1024 : 20 * 1024 * 1024

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / 1024 / 1024
      toast({
        title: "File Too Large",
        description: `Max size: ${maxSizeMB}MB`,
        variant: "destructive",
      })
      return false
    }

    const allowedTypes =
      type === "image"
        ? ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
        : ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: `Allowed: ${allowedTypes.join(", ")}`,
        variant: "destructive",
      })
      return false
    }

    console.log("✅ File validation passed")
    return true
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file, "image")) {
      setSelectedImage(file)
      setSelectedVideo(null)
      console.log("🖼️ Image selected:", file.name)
    }
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file, "video")) {
      setSelectedVideo(file)
      setSelectedImage(null)
      console.log("🎥 Video selected:", file.name)
    }
  }

  const uploadFile = async (file: File, type: "image" | "video"): Promise<string> => {
    if (!user || !storage) {
      throw new Error("User not authenticated or storage not available")
    }

    console.log(`📤 Uploading ${type}:`, file.name)

    const timestamp = Date.now()
    const fileName = `community-media/${user.uid}/${timestamp}-${file.name}`
    const storageRef = ref(storage, fileName)

    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    console.log(`✅ ${type} uploaded successfully:`, downloadURL)
    return downloadURL
  }

  const handleSubmitPost = async () => {
    if (!user || !db) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      })
      return
    }

    if (!newPost.trim() && !selectedImage && !selectedVideo) {
      toast({
        title: "Empty Post",
        description: "Please add some content to your post",
        variant: "destructive",
      })
      return
    }

    console.log("🚀 Starting post submission...")
    setUploading(true)

    try {
      let imageUrl = ""
      let videoUrl = ""

      if (selectedImage) {
        imageUrl = await uploadFile(selectedImage, "image")
      }

      if (selectedVideo) {
        videoUrl = await uploadFile(selectedVideo, "video")
      }

      const postData = {
        content: newPost.trim(),
        imageUrl,
        videoUrl,
        createdAt: serverTimestamp(),
        userId: user.uid,
        reactions: {
          likes: 0,
          hearts: 0,
        },
        reported: false,
        moderated: false,
      }

      console.log("💾 Creating post in Firestore...")
      const docRef = await addDoc(collection(db, "communityPosts"), postData)
      console.log("✅ Post created with ID:", docRef.id)

      // Reset form
      setNewPost("")
      setSelectedImage(null)
      setSelectedVideo(null)
      setShowNewPost(false)

      if (imageInputRef.current) imageInputRef.current.value = ""
      if (videoInputRef.current) videoInputRef.current.value = ""

      if (postsContainerRef.current) {
        postsContainerRef.current.scrollIntoView({ behavior: "smooth" })
      }

      toast({
        title: "Success! 🎉",
        description: "Your post has been shared with the community",
        variant: "success",
      })
      console.log("🎉 Post submission completed")
    } catch (error: any) {
      console.error("❌ Post submission failed:", error)

      let errorMessage = "Failed to create post"
      if (error.code === "permission-denied") {
        errorMessage = "Permission denied. Check your account permissions."
      } else if (error.code === "unavailable") {
        errorMessage = "Service temporarily unavailable"
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Post Failed ❌",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleReply = async (postId: string, content: string) => {
    if (!user || !db) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      })
      return
    }

    console.log("💬 Adding reply to post:", postId)

    try {
      const replyData = {
        content,
        createdAt: serverTimestamp(),
        userId: user.uid,
      }

      await addDoc(collection(db, `communityPosts/${postId}/replies`), replyData)
      console.log("✅ Reply added successfully")
      toast({
        title: "Reply Added!",
        description: "Your reply has been posted",
        variant: "success",
      })
    } catch (error) {
      console.error("❌ Failed to add reply:", error)
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      })
    }
  }

  const handleReact = async (postId: string, type: "like" | "heart") => {
    if (!user || !db) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      })
      return
    }

    console.log(`${type === "like" ? "👍" : "❤️"} Reacting to post:`, postId)

    try {
      const postRef = doc(db, "communityPosts", postId)
      await updateDoc(postRef, {
        [`reactions.${type}s`]: increment(1),
      })
      console.log("✅ Reaction added")
    } catch (error) {
      console.error("❌ Failed to add reaction:", error)
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header user={user} title="Community Forum" subtitle="Share & Connect" />

        <main className="max-w-4xl mx-auto p-4 pb-32">
          {/* Community Header */}
          <div className="text-center mb-8 mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="bg-purple-600 p-6 rounded-3xl w-fit mx-auto mb-6">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🧑‍🤝‍🧑 Community Forum</h2>
              <p className="text-lg text-gray-600 mb-6">Share your thoughts anonymously</p>

              <div className="flex justify-center space-x-4 text-3xl mb-6">
                <span title="Be Kind">🤝</span>
                <span title="Stay Safe">🛡️</span>
                <span title="Share Stories">💬</span>
                <span title="Support Others">❤️</span>
              </div>
            </motion.div>
          </div>

          {/* New Post Button */}
          <div className="mb-8">
            <Button
              onClick={() => setShowNewPost(!showNewPost)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl shadow-lg text-lg font-semibold"
            >
              <Plus className="w-6 h-6 mr-3" />
              ✍️ Share Something
            </Button>
          </div>

          {/* New Post Form */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <Card className="p-6 bg-white/90 backdrop-blur-sm">
                  <div className="space-y-4">
                    <Textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="📝 Share your thoughts, experiences, or ask for support..."
                      className="min-h-[120px] text-base border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                      maxLength={500}
                    />

                    <div className="text-sm text-gray-500 text-right">{newPost.length}/500 characters</div>

                    {/* Media Preview */}
                    {selectedImage && (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                          alt="Selected"
                          className="max-h-48 rounded-lg mx-auto"
                        />
                        <Button
                          onClick={() => setSelectedImage(null)}
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {selectedVideo && (
                      <div className="relative">
                        <video
                          src={URL.createObjectURL(selectedVideo)}
                          className="max-h-48 rounded-lg mx-auto"
                          controls
                        />
                        <Button
                          onClick={() => setSelectedVideo(null)}
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Media Upload Buttons */}
                    <div className="flex space-x-3">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Button
                        onClick={() => imageInputRef.current?.click()}
                        variant="outline"
                        className="flex-1"
                        disabled={!!selectedVideo}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        🖼️ Photo (5MB)
                      </Button>

                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={handleVideoSelect}
                        className="hidden"
                      />
                      <Button
                        onClick={() => videoInputRef.current?.click()}
                        variant="outline"
                        className="flex-1"
                        disabled={!!selectedImage}
                      >
                        <Video className="w-4 h-4 mr-2" />📹 Video (20MB)
                      </Button>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-3">
                      <Button onClick={() => setShowNewPost(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitPost}
                        disabled={uploading || (!newPost.trim() && !selectedImage && !selectedVideo)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />📤 Post
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts Feed */}
          <div ref={postsContainerRef} className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                👁️ Community Posts ({posts.length})
              </h3>
            </div>

            <AnimatePresence>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Be the first to share something with the community!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <CommunityPostItem key={post.id} post={post} onReply={handleReply} onReact={handleReact} />
                ))
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
