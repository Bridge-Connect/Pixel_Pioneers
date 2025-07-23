"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../lib/firebase"
import { ArrowLeft, Trophy, CheckCircle, XCircle, RotateCcw, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

const quizData: Record<string, Record<string, QuizQuestion[]>> = {
  "academic-subjects": {
    alphabets: [
      {
        id: 1,
        question: "Which letter comes after 'A'?",
        options: ["B", "C", "D"],
        correctAnswer: 0,
        explanation: "B comes right after A in the alphabet sequence.",
      },
      {
        id: 2,
        question: "Which letter comes before 'D'?",
        options: ["B", "C", "E"],
        correctAnswer: 1,
        explanation: "C comes right before D in the alphabet sequence.",
      },
      {
        id: 3,
        question: "What is the first letter of the alphabet?",
        options: ["B", "A", "C"],
        correctAnswer: 1,
        explanation: "A is the very first letter of the alphabet.",
      },
      {
        id: 4,
        question: "Which letter comes after 'C'?",
        options: ["D", "E", "B"],
        correctAnswer: 0,
        explanation: "D comes right after C in the alphabet sequence.",
      },
      {
        id: 5,
        question: "Which letter comes before 'C'?",
        options: ["A", "B", "D"],
        correctAnswer: 1,
        explanation: "B comes right before C in the alphabet sequence.",
      },
    ],
  },
}

export default function LearningQuizPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)

  const router = useRouter()
  const params = useParams()

  const categoryId = params?.category as string
  const subCategoryId = params?.sub as string

  const questions = quizData[categoryId]?.[subCategoryId] || []

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setAnswers(new Array(questions.length).fill(null))
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, questions.length])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = selectedAnswer
      setAnswers(newAnswers)

      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1)
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizCompleted(true)
      }
    }
  }

  const handleShowResult = () => {
    setShowResult(true)
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers(new Array(questions.length).fill(null))
    setQuizCompleted(false)
  }

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100)
  }

  const getScoreMessage = () => {
    const percentage = getScorePercentage()
    if (percentage >= 90) return "Excellent! 🌟"
    if (percentage >= 70) return "Great job! 👏"
    if (percentage >= 50) return "Good effort! 👍"
    return "Keep practicing! 💪"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Available</h2>
          <Button onClick={() => router.push("/learning-path")}>Back to Learning Path</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/learning-path/${categoryId}/${subCategoryId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Lessons</span>
            </Button>

            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <h1 className="text-xl font-bold text-gray-900">Quiz Time</h1>
            </div>

            {!quizCompleted && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {currentQuestion + 1}/{questions.length}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizCompleted ? (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 text-center">
                  {questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full p-4 text-left justify-start text-lg ${
                        selectedAnswer === index ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Result Display */}
            {showResult && (
              <Card
                className={`mb-6 ${
                  selectedAnswer === questions[currentQuestion].correctAnswer
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                      <>
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Correct! 🎉</h3>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Not quite right 😔</h3>
                        <p className="text-red-700 mb-2">
                          The correct answer is:{" "}
                          <strong>
                            {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
                          </strong>
                        </p>
                      </>
                    )}
                    {questions[currentQuestion].explanation && (
                      <p className="text-sm text-gray-600 mt-3">{questions[currentQuestion].explanation}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!showResult ? (
                <Button
                  onClick={handleShowResult}
                  disabled={selectedAnswer === null}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Quiz Results */
          <div className="text-center">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Quiz Complete!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {score}/{questions.length}
                    </div>
                    <div className="text-lg text-gray-600">{getScorePercentage()}% Score</div>
                    <div className="text-xl font-semibold text-gray-900 mt-2">{getScoreMessage()}</div>
                  </div>

                  {/* Score Visualization */}
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: questions.length }, (_, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full ${
                          answers[index] === questions[index].correctAnswer ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Performance Badge */}
                  <div className="flex justify-center">
                    <Badge
                      variant="secondary"
                      className={`text-lg px-4 py-2 ${
                        getScorePercentage() >= 70 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {getScorePercentage() >= 90 ? "Master" : getScorePercentage() >= 70 ? "Proficient" : "Learning"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleRestartQuiz} variant="outline" className="flex-1 bg-transparent" size="lg">
                <RotateCcw className="h-5 w-5 mr-2" />
                Retake Quiz
              </Button>
              <Button
                onClick={() => router.push(`/learning-path/${categoryId}/${subCategoryId}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Back to Lessons
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
