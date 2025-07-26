"use client"

import { ArrowLeft, Bed, CheckCircle2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import HeaderNavigation from "@/components/layout/HeaderNavigation"
import { getCompletedLessons } from "@/lib/firebase-client";

export const subcategoryData = {
  alphabets: {
    title: "Alphabets",
    items: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
      { id: "d", label: "D" },
      { id: "e", label: "E" },
      { id: "f", label: "F" },
      { id: "g", label: "G" },
      { id: "h", label: "H" },
      { id: "i", label: "I" },
      { id: "j", label: "J" },
      { id: "k", label: "K" },
      { id: "l", label: "L" },
      { id: "m", label: "M" },
      { id: "n", label: "N" },
      { id: "o", label: "O" },
      { id: "p", label: "P" },
      { id: "q", label: "Q" },
      { id: "r", label: "R" },
      { id: "s", label: "S" },
      { id: "t", label: "T" },
      { id: "u", label: "U" },
      { id: "v", label: "V" },
      { id: "w", label: "W" },
      { id: "x", label: "X" },
      { id: "y", label: "Y" },
      { id: "z", label: "Z" },
    ],
  },
  numbers: {
    title: "Numbers",
    items: [
      { id: "0", label: "0" },
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
      { id: "4", label: "4" },
      { id: "5", label: "5" },
      { id: "6", label: "6" },
      { id: "7", label: "7" },
      { id: "8", label: "8" },
      { id: "9", label: "9" },
      { id: "10", label: "10" },
    ],
  },
  colors: {
    title: "Colors",
    items: [
      { id: "red", label: "Red" },
      { id: "blue", label: "Blue" },
      { id: "green", label: "Green" },
      { id: "yellow", label: "Yellow" },
      { id: "orange", label: "Orange" },
      { id: "black", label: "Black" },
      { id: "white", label: "White" },
    ],
  },
  greetings: {
    title: "Greetings",
    items: [
      { id: "hello", label: "Hello" },
      { id: "thank-you", label: "Thank You" },
      { id: "please", label: "Please" },
      { id: "sorry", label: "Sorry" },
      { id: "welcome", label: "Welcome" },
    ],
  },
  questions: {
    title: "Questions",
    items: [
      { id: "what", label: "What" },
      { id: "where", label: "Where" },
      { id: "when", label: "When" },
      { id: "who", label: "Who" },
      { id: "why", label: "Why" },
      { id: "how", label: "How" },
      { id: "which", label: "Which" },
    ],
  },
  words: {
    title: "Words",
    items: [
      { id: "apple", label: "A-Apple" },
      { id: "banana", label: "B-Banana" },
      { id: "cat", label: "C-Cat" },
      { id: "dog", label: "D-Dog" },
      { id: "elephant", label: "E-Elephant" },
      { id: "frog", label: "F-Frog" },
      { id: "giraffe", label: "G-Giraffe" },
      { id: "horse", label: "H-Horse" },
      { id: "ice-cream", label: "I-Ice Cream" },
      { id: "jewelery", label: "J-Jewelery" },
      { id: "kite", label: "K-Kite" },
      { id: "lion", label: "L-Lion" },
      { id: "mango", label: "M-Mango" },
      { id: "nurses", label: "N-Nurses" },
      { id: "orange", label: "O-Orange" },
      { id: "pizza", label: "P-Pizza" },
      { id: "queen", label: "Q-Queen" },
      { id: "rat", label: "R-Rat" },
      { id: "snake", label: "S-Snake" },
      { id: "time", label: "T-Time" },
      { id: "umbrella", label: "U-Umbrella" },
      { id: "van", label: "V-Van" },
      { id: "watermelon", label: "W-Watermelon" },
      { id: "xylophone", label: "X-Xylophone" },
      { id: "yoga", label: "Y-Yoga" },
      { id: "zebra", label: "Z-Zebra" },
    ],
  },
  emotions: {
    title: "Emotions",
    items: [
      { id: "happy", label: "Happy" },
      { id: "sad", label: "Sad" },
      { id: "angry", label: "Angry" },
      { id: "excited", label: "Excited" },
      { id: "scared", label: "Scared" },
      { id: "surprised", label: "Surprised" },
      { id: "grateful", label: "Grateful" },
    ],
  },
  family: {
    title: "Family",
    items: [
      { id: "father", label: "Father" },
      { id: "mother", label: "Mother" },
      { id: "sister", label: "Sister" },
      { id: "grandmother", label: "Grandmother" },
      { id: "grandfather", label: "Grandfather" },
      { id: "aunt", label: "Aunt" },
      { id: "uncle", label: "Uncle" },
      { id: "cousin", label: "Cousin" },
    ],
  },
  food: {
    title: "Food",
    items: [
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
      { id: "carrot", label: "Carrot" },
      { id: "egg", label: "Egg" },
      { id: "fish", label: "Fish" },
      { id: "grape", label: "Grape" },
      { id: "rice", label: "Rice" },
    ],
  },
  school:{
    title: "School",
    items: [
      { id: "book", label: "Book" },
      { id: "blackboard_duster", label: "Blackboard" },
      { id: "class", label: "Class" },
      { id: "exam", label: "Exam" },
      { id: "homework", label: "Homework" },
      { id: "answer", label: "Answer" },
      { id: "question", label: "Question" }
    ],
  },
  home:{
    title: "Home",
    items: [
      { id: "chair", label: "Chair" },
      { id: "fan", label: "Fan" },
      { id: "water", label: "Water" },
      { id: "food", label: "Food" },
      { id: "clothes", label: "Clothes" },
      { id: "bathroom", label: "Bathroom" },
      { id: "bedroom", label: "Bedroom" },
      { id: "soap", label: "Soap" },
      { id: "door", label: "Door" },
    ],
  },
  requests:{
    title: "Requests",
    items: [
      { id: "please", label: "Please" },
      { id: "help", label: "Help" },
      { id: "sit", label: "Sit" },
      { id: "stand", label: "Stand" },
      { id: "stop", label: "Stop" },
    ],
  },
  "responses":{
    title: "Responses",
    items: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "okay", label: "Okay" },
      { id: "thank-you", label: "Thank You" },
      { id: "sorry", label: "Sorry" },
    ],
  },
  "maths-basics": {
    title: "Maths Basics",
    items: [
      { id: "addition", label: "Addition(+)" },
      { id: "subtraction", label: "Subtraction(-)" },
      { id: "multiplication", label: "Multiplication(x)" },
      { id: "division", label: "Division(÷)" },
      ],
  },
  "places-around-us": {
    title: "Places Around Us",
    items: [
      { id: "school", label: "School" },
      { id: "home", label: "Home" },
      { id: "park", label: "Park" },
      { id: "hospital", label: "Hospital" },
      { id: "library", label: "Library" },
      { id: "market", label: "Market" },
    ],
  },
  "body":{
    title: "Body",
    items: [
      { id: "head", label: "Head" },
      { id: "hand", label: "Hand" },
      { id: "leg", label: "Leg" },
      { id: "arm", label: "Arm" },
      { id: "ear", label: "Ear" },
      { id: "eye", label: "Eye" },
      { id: "mouth", label: "Mouth" },
      { id: "nose", label: "Nose" },
    ],
  }

}

const categoryData = {
  academic: {
    title: "Academic Subjects",
    subcategories: [
      { id: "alphabets", title: "Alphabets" },
      { id: "words", title: "Words" },
      { id: "numbers", title: "Numbers" },
      { id: "maths-basics", title: "Maths Basics" },
    ],
  },
  "life-skills": {
    title: "Life Skills",
    subcategories: [
      { id: "colors", title: "Colors" },
      { id: "emotions", title: "Emotions" },
      { id: "family", title: "Family" },
      { id: "food", title: "Food" },
    ],
  },
  "daily-conversations": {
    title: "Daily Conversations",
    subcategories: [
      { id: "greetings", title: "Greetings" },
      { id: "questions", title: "Questions" },
      { id: "requests", title: "Requests" },
      { id: "responses", title: "Responses" },
    ],
  },
  "important-vocabulary": {
    title: "Important Vocabulary",
    subcategories: [
      { id: "body", title: "Body" },
      { id: "places-around-us", title: "Places Around Us" },
      { id: "home", title: "Home" },
      { id: "school", title: "School" },
    ],
  },
};

export default function SubcategoryPage() {
  const params = useParams()
  const categoryId = params.id as string
  const subcategoryId = params.subcategory as string
  const subcategory = subcategoryData[subcategoryId as keyof typeof subcategoryData]
  // Remove quiz state
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
      // Removed setShowQuiz cleanup
    };
  }, []);

  if (!subcategory) {
    return <div>Subcategory not found</div>
  }

  const completedItems = subcategory.items.filter((item) => completedLessons.includes(item.id)).length
  const totalItems = subcategory.items.length
  const progressPercentage = (completedItems / totalItems) * 100
  const allCompleted = completedItems === totalItems

  // Correct next section logic for the current category
  const category = categoryData[categoryId as keyof typeof categoryData];
  const subcategoryList = category?.subcategories || [];
  const currentIndex = subcategoryList.findIndex(sub => sub.id === subcategoryId);
  let nextSectionHref: string | null = null;
  let nextSectionLabel: string | null = null;
  if (allCompleted) {
    if (currentIndex !== -1 && currentIndex < subcategoryList.length - 1) {
      const nextSubcategory = subcategoryList[currentIndex + 1];
      nextSectionHref = `/learning-path/category/${categoryId}/${nextSubcategory.id}`;
      nextSectionLabel = `Next: ${nextSubcategory.title}`;
    } else if (currentIndex === subcategoryList.length - 1) {
      nextSectionHref = `/learning-path`;
      nextSectionLabel = "Back to Learning Path";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white">
      <HeaderNavigation user={user} />
      <main className="max-w-6xl mx-auto p-4">
        {/* Welcome Section */}
        <div className="text-center mb-12 mt-8">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-6 px-6 py-2 text-lg font-semibold shadow-lg rounded-2xl">
            {subcategory.title}
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
            Practice your skills in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 ml-2">
              {subcategory.title}
            </span>
          </h1>
        </div>
        {/* Removed Quiz Button */}

        {/* Items Grid */}
        <div className="flex flex-wrap gap-3 justify-center">
          {subcategory.items.map((item) => (
            <Link key={item.id} href={`/learning-path/category/${categoryId}/${subcategoryId}/${item.id}`}>
              <button
                className={`min-w-[80px] h-20 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                  completedLessons.includes(item.id)
                    ? "bg-green-500 text-white shadow-lg hover:bg-green-600"
                    : "bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{item.label}</span>
                  {completedLessons.includes(item.id) && <CheckCircle2 className="w-4 h-4 mt-1" />}
                </div>
              </button>
            </Link>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 flex flex-col items-center">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-700">{completedItems} of {totalItems} completed ({Math.round(progressPercentage)}%)</span>
          
          {/* Navigation Buttons */}
          <div className="mt-6 w-full flex justify-between items-center">
            {/* Back Button - Always on the left */}
            <Link href={`/learning-path/category/${categoryId}`}>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to {category?.title || 'Category'}
              </button>
            </Link>
            
            {/* Next Section Button - Only on the right when progress is 100% */}
            {nextSectionHref && nextSectionLabel && (
              <Link href={nextSectionHref}>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 animate-fade-in"
                >
                  {nextSectionLabel} <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p>Tap any item to start learning</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p>Watch the video and practice</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p>Mark as complete when ready</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Removed Quiz Modal */}
    </div>
  )
}
