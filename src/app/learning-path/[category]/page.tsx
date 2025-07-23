'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for subcategories
const subcategoriesData = {
  'academic-subjects': [
    { id: 'alphabets', title: 'Alphabets', description: 'Learn A-Z in ISL', completed: false, unlocked: true },
    { id: 'numbers', title: 'Numbers', description: 'Learn 0-100 in ISL', completed: false, unlocked: false },
    { id: 'colors', title: 'Colors', description: 'Basic and advanced colors', completed: false, unlocked: false },
    { id: 'shapes', title: 'Shapes', description: 'Geometric shapes and forms', completed: false, unlocked: false },
  ],
  'life-skills': [
    { id: 'family', title: 'Family', description: 'Family members and relations', completed: false, unlocked: true },
    { id: 'food', title: 'Food & Drinks', description: 'Common food items', completed: false, unlocked: false },
    { id: 'clothing', title: 'Clothing', description: 'Clothes and accessories', completed: false, unlocked: false },
    { id: 'home', title: 'Home & Furniture', description: 'Household items', completed: false, unlocked: false },
  ],
  'daily-conversations': [
    { id: 'greetings', title: 'Greetings', description: 'Hello, goodbye, thank you', completed: false, unlocked: true },
    { id: 'questions', title: 'Questions', description: 'Who, what, when, where, why', completed: false, unlocked: false },
    { id: 'emotions', title: 'Emotions', description: 'Happy, sad, angry, excited', completed: false, unlocked: false },
    { id: 'directions', title: 'Directions', description: 'Left, right, up, down', completed: false, unlocked: false },
  ],
  'important-vocabulary': [
    { id: 'medical', title: 'Medical Terms', description: 'Hospital, doctor, medicine', completed: false, unlocked: true },
    { id: 'emergency', title: 'Emergency', description: 'Help, police, fire, ambulance', completed: false, unlocked: false },
    { id: 'education', title: 'Education', description: 'School, teacher, student, book', completed: false, unlocked: false },
    { id: 'technology', title: 'Technology', description: 'Computer, phone, internet', completed: false, unlocked: false },
  ],
};

const categoryTitles = {
  'academic-subjects': 'Academic Subjects',
  'life-skills': 'Life Skills',
  'daily-conversations': 'Daily Conversations',
  'important-vocabulary': 'Important Vocabulary',
};

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;

  const subcategories = subcategoriesData[category as keyof typeof subcategoriesData] || [];
  const categoryTitle = categoryTitles[category as keyof typeof categoryTitles] || category;

  const handleSubcategoryClick = (subcategoryId: string, unlocked: boolean) => {
    if (unlocked) {
      router.push(`/learning-path/${category}/${subcategoryId}`);
    }
  };

  const handleBackClick = () => {
    router.push('/learning-path');
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
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete lessons in order to unlock new content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subcategories.map((subcategory, index) => (
            <Card
              key={subcategory.id}
              className={`transition-all duration-200 ${
                subcategory.unlocked
                  ? 'cursor-pointer hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => handleSubcategoryClick(subcategory.id, subcategory.unlocked)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                  {subcategory.completed ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : subcategory.unlocked ? (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">{index + 1}</span>
                    </div>
                  ) : (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-xl md:text-2xl">{subcategory.title}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {subcategory.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center">
                  <div className={`text-sm ${
                    subcategory.completed 
                      ? 'text-green-500 font-medium' 
                      : subcategory.unlocked 
                        ? 'text-muted-foreground' 
                        : 'text-muted-foreground'
                  }`}>
                    {subcategory.completed 
                      ? 'Completed!' 
                      : subcategory.unlocked 
                        ? 'Tap to start' 
                        : 'Complete previous lessons to unlock'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}