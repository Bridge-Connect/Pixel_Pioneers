"use client"

import { ArrowLeft, Lock, CheckCircle2, GraduationCap, Palette, MessageSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import HeaderNavigation from "@/components/layout/HeaderNavigation"
import { getCompletedLessons } from "@/lib/firebase-client";
import { subcategoryData } from "./[subcategory]/page";

const categoryData = {
  academic: {
    title: "Academic Subjects",
    icon: GraduationCap,
    color: "bg-blue-500",
    subcategories: [
      { id: "alphabets", title: "Alphabets" },
      { id: "words", title: "Words" },
      { id: "numbers", title: "Numbers" },
      { id: "maths-basics", title: "Maths Basics" },
    ],
  },
  "life-skills": {
    title: "Life Skills",
    icon: Palette,
    color: "bg-green-500",
    subcategories: [
      { id: "colors", title: "Colors" },
      { id: "emotions", title: "Emotions" },
      { id: "family", title: "Family" },
      { id: "food", title: "Food" },
    ],
  },
  "daily-conversations": {
    title: "Daily Conversations",
    icon: MessageSquare,
    color: "bg-purple-500",
    subcategories: [
      { id: "greetings", title: "Greetings" },
      { id: "questions", title: "Questions" },
      { id: "requests", title: "Requests" },
      { id: "responses", title: "Responses" },
    ],
  },
  "important-vocabulary": {
    title: "Important Vocabulary",
    icon: Star,
    color: "bg-orange-500",
    subcategories: [
      { id: "body", title: "Body" },
      { id: "places-around-us", title: "Places Around Us" },
      { id: "home", title: "Home" },
      { id: "school", title: "School" },
    ],
  },
}

// Add a mapping from subcategory id to emoji and color
const subcategoryIcons: { [key: string]: { emoji: string; color: string } } = {
  alphabets: { emoji: "🔤", color: "bg-blue-400" },
  numbers: { emoji: "🔢", color: "bg-green-400" },
  "maths-basics": { emoji: "➗", color: "bg-yellow-400" },
  words: { emoji: "📝", color: "bg-pink-400" },
  colors: { emoji: "🎨", color: "bg-purple-400" },
  emotions: { emoji: "🙂", color: "bg-orange-400" },
  family: { emoji: "👪", color: "bg-teal-400" },
  food: { emoji: "🍎", color: "bg-red-400" },
  greetings: { emoji: "👋", color: "bg-blue-400" },
  questions: { emoji: "❓", color: "bg-green-400" },
  requests: { emoji: "🙏", color: "bg-yellow-400" },
  responses: { emoji: "💬", color: "bg-purple-400" },
  body: { emoji: "👤", color: "bg-red-400" },
  "places-around-us" : { emoji: "📍", color: "bg-pink-400" },
  home: { emoji: "🏠", color: "bg-blue-400" },
  school: { emoji: "🏫", color: "bg-green-400" },
};

export default function CategoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        getCompletedLessons(user.uid).then(setCompletedLessons);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const params = useParams()
  const categoryId = params.id as string
  const category = categoryData[categoryId as keyof typeof categoryData]

  if (!category) {
    return <div>Category not found</div>
  }

  // Calculate progress and unlock state for each subcategory
  let lastCompleted = true;
  const subcategoriesWithProgress = category.subcategories.map((sub, idx, arr) => {
    const subData = subcategoryData[sub.id as keyof typeof subcategoryData];
    if (!subData) return { ...sub, progress: 0, isCompleted: false, isUnlocked: false };
    const total = subData.items.length;
    const completed = subData.items.filter((item: any) => completedLessons.includes(item.id)).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isCompleted = progress === 100;
    // Unlock logic: first is always unlocked, others only if previous is completed
    const isUnlocked = idx === 0 ? true : lastCompleted;
    lastCompleted = isCompleted;
    return {
      ...sub,
      progress,
      isCompleted,
      isUnlocked,
    };
  });
  const totalSubcategories = subcategoriesWithProgress.length;
  const completedSubcategories = subcategoriesWithProgress.filter((sub) => sub.isCompleted).length;

  const IconComponent = category.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white">
      <HeaderNavigation user={user} />
      <main className="max-w-6xl mx-auto p-4">
        {/* Welcome Section */}
        <div className="text-center mb-12 mt-8">
          <div className="inline-block bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-green-300 mb-6 px-8 py-4 text-2xl font-extrabold shadow-xl rounded-3xl">
            {category.title}
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-800 mb-6 drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Choose a topic
            </span>
          </h1>
        </div>
        {/* Y Overview */}
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-lg border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
            <div className="text-lg text-gray-700">
              {completedSubcategories}/{totalSubcategories} completed
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${category.color} transition-all duration-500`}
              style={{
                width: `${(completedSubcategories / totalSubcategories) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {subcategoriesWithProgress.map((subcategory, index) => {
            const icon = subcategoryIcons[subcategory.id] || { emoji: "❔", color: "bg-gray-300" };
            return (
              <Card
                key={subcategory.id}
                className={`border-2 rounded-3xl transition-all duration-300 ${
                  subcategory.isUnlocked
                    ? "border-gray-200 hover:border-blue-400 hover:shadow-2xl cursor-pointer"
                    : "border-gray-100 opacity-60"
                } ${subcategory.isCompleted ? "bg-green-50 border-green-200" : "bg-white"}`}
              >
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center mb-4">
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-3 text-6xl shadow-lg ${icon.color} group-hover:scale-110 transition-transform`}>
                      <span>{icon.emoji}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-md">{subcategory.title}</h3>
                  </div>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-base text-gray-700 mb-2">
                      <span>Progress</span>
                      <span>{subcategory.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          subcategory.isCompleted ? "bg-green-500" : category.color
                        }`}
                        style={{ width: `${subcategory.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* Action Button */}
                  {subcategory.isUnlocked ? (
                    <Link href={`/learning-path/category/${categoryId}/${subcategory.id}`}>
                      <Button className={`w-full ${category.color} hover:opacity-90 text-white text-lg font-bold py-3 rounded-xl`}>
                        {subcategory.isCompleted ? "Review" : subcategory.progress > 0 ? "Continue" : "Start"}
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full bg-gray-200 text-gray-500 cursor-not-allowed text-lg font-bold py-3 rounded-xl">
                      <Lock className="w-5 h-5 mr-2" />
                      Locked
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Achievement Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-300 to-orange-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Star className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Keep Learning!</h3>
          <p className="text-lg text-gray-700">
            Complete all topics to unlock the next category and earn achievements
          </p>
        </div>
      </main>
    </div>
  )
}
