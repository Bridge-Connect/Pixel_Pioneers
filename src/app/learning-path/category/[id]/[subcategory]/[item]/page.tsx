"use client"

import type React from "react"

import { ArrowLeft, Video, Brush, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { markLessonComplete, getCompletedLessons } from "@/lib/firebase-client";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import HeaderNavigation from "@/components/layout/HeaderNavigation"

// const itemData = {
//   A: {
//     title: "Letter A",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//   },
//   B: {
//     title: "Letter B",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//   },
//   "1": {
//     title: "Number 1",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//   },
//   red: {
//     title: "Color Red",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//   },
//   hello: {
//     title: "Hello",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//   },
// }

// Add helper function to extract Google Drive file ID
function getDriveId(url: string): string | undefined {
  const match = url.match(/\/d\/([\w-]+)/) || url.match(/id=([\w-]+)/);
  return match ? match[1] : undefined;
}

export default function LessonPage() {
  const [user, setUser] = useState<User | null>(null)
  const params = useParams()
  const categoryId = decodeURIComponent(params.id as string)
  const subcategoryId = decodeURIComponent(params.subcategory as string)
  const itemId = decodeURIComponent(params.item as string)
  const [videoUrl, setVideoUrl] = useState("");
  const [itemTitle, setItemTitle] = useState(itemId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        getCompletedLessons(user.uid).then((completed) => {
          setIsCompleted(completed.includes(itemId));
        });
      }
    });
    return () => {
      unsubscribe();
      // Add cleanup for any modal state here if needed in the future
    };
  }, [itemId]);

  useEffect(() => {
    // Fetch videoUrl from Firestore
    const fetchVideoUrl = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const lessonRef = doc(db, "Lessons", itemId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
          const data = lessonSnap.data();
          setVideoUrl(data.link || "");
          setItemTitle(data.title || itemId);
        } else {
          setVideoUrl("");
          setItemTitle(itemId);
        }
      } catch (e) {
        setVideoUrl("");
        setItemTitle(itemId);
      }
      setLoading(false);
    };
    fetchVideoUrl();
  }, [itemId]);

  const [isCompleted, setIsCompleted] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleMarkComplete = async () => {
    if (!user) return;
    await markLessonComplete(user.uid, itemId);
    // Re-fetch completed lessons to ensure UI is in sync
    const completed = await getCompletedLessons(user.uid);
    setIsCompleted(completed.includes(itemId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white">
      <HeaderNavigation user={user} />
      <main className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-12 mt-8">
          {/* <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 mb-6 px-6 py-2 text-lg font-semibold shadow-lg rounded-2xl">
            {itemTitle}
          </div> */}
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
            Learn the sign for  
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 ml-2">
              {itemTitle}
            </span>
          </h1>
        </div>
        {/* Item Display & Video */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-8">
            {/* Large Item Display */}
            <div className="text-center mb-8">
              <div className={`text-8xl font-bold mb-4 ${isCompleted ? "text-green-600" : "text-gray-900"}`}>{itemId.toUpperCase()}</div>
              {/* <h2 className="text-2xl font-semibold text-gray-700">{itemTitle}</h2> */}
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg opacity-75">Loading video...</p>
                  </div>
                </div>
              ) : videoUrl ? (
                videoUrl.includes("drive.google.com") && getDriveId(videoUrl) ? (
                  // Render Google Drive video in iframe
                  <iframe
                    src={`https://drive.google.com/file/d/${getDriveId(videoUrl)}/preview`}
                    allow="autoplay"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    controls
                  >
                    <source src={videoUrl} type="video/mp4" />
                    <track kind="captions" src="/captions.vtt" srcLang="en" label="English captions" />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg opacity-75">No video available.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Practice Board */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Brush className="w-6 h-6" />
                Practice Board
              </h3>
              <Button onClick={clearCanvas} variant="outline" size="sm">
                Clear
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="w-full h-64 bg-white rounded-lg cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div className="text-center mt-4">
                <Brush className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Practice Here</p>
                <p className="text-sm text-gray-400 mt-1">
                  Draw the hand shape or practice the sign
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Button */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            {!isCompleted ? (
              <Button onClick={handleMarkComplete} className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white">
                <CheckCircle className="w-6 h-6 mr-3" />
                Mark as Complete
              </Button>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-700 mb-2">Completed!</h3>
                <p className="text-gray-600 mb-4">Great job learning the sign for "{itemTitle}"</p>
                <Link href={`/learning-path/category/${categoryId}/${subcategoryId}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">Continue Learning</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
