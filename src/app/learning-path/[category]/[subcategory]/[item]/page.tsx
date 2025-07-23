'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Brush, CheckCircle, ArrowLeft, Play } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

// Mock data for lesson content
const lessonContent = {
  a: {
    title: 'Letter A',
    description: 'Learn how to sign the letter A in Indian Sign Language',
    videoUrl: 'placeholder-video-url',
    instructions: 'Make a fist with your thumb pointing upward along the side of your index finger.',
    tips: 'Keep your thumb visible and straight. Practice the movement slowly at first.',
  },
  b: {
    title: 'Letter B',
    description: 'Learn how to sign the letter B in Indian Sign Language',
    videoUrl: 'placeholder-video-url',
    instructions: 'Hold your hand up with fingers extended and together, thumb folded across your palm.',
    tips: 'Keep all four fingers straight and close together. Thumb should be hidden behind your fingers.',
  },
  hello: {
    title: 'Hello',
    description: 'Learn how to sign Hello in Indian Sign Language',
    videoUrl: 'placeholder-video-url',
    instructions: 'Raise your right hand to your forehead and move it away from your head in a small arc.',
    tips: 'Start with your hand near your forehead and move it outward in a greeting motion.',
  },
  mother: {
    title: 'Mother',
    description: 'Learn how to sign Mother in Indian Sign Language',
    videoUrl: 'placeholder-video-url',
    instructions: 'Touch your chin with your thumb, then move your hand down to touch your chest.',
    tips: 'This sign represents the nurturing and caring nature of a mother.',
  },
  doctor: {
    title: 'Doctor',
    description: 'Learn how to sign Doctor in Indian Sign Language',
    videoUrl: 'placeholder-video-url',
    instructions: 'Make the letter D and tap it on your wrist as if checking a pulse.',
    tips: 'Remember that doctors check your health, which is why we tap the wrist.',
  },
};

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const subcategory = params.subcategory as string;
  const item = params.item as string;
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  const lesson = lessonContent[item as keyof typeof lessonContent] || {
    title: item.toUpperCase(),
    description: `Learn how to sign ${item} in Indian Sign Language`,
    videoUrl: 'placeholder-video-url',
    instructions: 'Follow the video demonstration to learn this sign.',
    tips: 'Practice regularly to improve your signing skills.',
  };

  const handleBackClick = () => {
    router.push(`/learning-path/${category}/${subcategory}`);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    // Here you would typically save the completion status to your backend
    setTimeout(() => {
      router.push(`/learning-path/${category}/${subcategory}`);
    }, 1500);
  };

  const togglePractice = () => {
    setShowPractice(!showPractice);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {lesson.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {lesson.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Demonstration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video Player Placeholder</p>
                  <Button className="mt-4" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Play Video
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <p className="text-sm text-muted-foreground">{lesson.instructions}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tips:</h4>
                  <p className="text-sm text-muted-foreground">{lesson.tips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brush className="w-5 h-5" />
                Practice Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  {showPractice ? (
                    <div className="space-y-4">
                      <Brush className="w-16 h-16 text-primary mx-auto" />
                      <p className="text-foreground">Practice Area Active</p>
                      <p className="text-sm text-muted-foreground">
                        Try signing "{lesson.title}" following the video instructions
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Brush className="w-16 h-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Click to start practicing</p>
                    </div>
                  )}
                </div>
              </div>
              <Button 
                onClick={togglePractice}
                variant={showPractice ? "secondary" : "default"}
                className="w-full"
              >
                {showPractice ? "Stop Practice" : "Start Practice"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Completion Section */}
        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              {isCompleted ? (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-600">
                    Lesson Completed!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Great job! Moving back to lesson selection...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">Ready to complete?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Make sure you've watched the video and practiced the sign
                  </p>
                  <Button 
                    onClick={handleComplete}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}