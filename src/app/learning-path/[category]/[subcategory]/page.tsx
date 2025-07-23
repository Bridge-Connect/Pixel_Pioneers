'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for items
const itemsData = {
  alphabets: [
    { id: 'a', name: 'A', completed: true },
    { id: 'b', name: 'B', completed: true },
    { id: 'c', name: 'C', completed: false },
    { id: 'd', name: 'D', completed: false },
    { id: 'e', name: 'E', completed: false },
    { id: 'f', name: 'F', completed: false },
    { id: 'g', name: 'G', completed: false },
    { id: 'h', name: 'H', completed: false },
    { id: 'i', name: 'I', completed: false },
    { id: 'j', name: 'J', completed: false },
    { id: 'k', name: 'K', completed: false },
    { id: 'l', name: 'L', completed: false },
  ],
  numbers: [
    { id: '0', name: '0', completed: false },
    { id: '1', name: '1', completed: false },
    { id: '2', name: '2', completed: false },
    { id: '3', name: '3', completed: false },
    { id: '4', name: '4', completed: false },
    { id: '5', name: '5', completed: false },
    { id: '6', name: '6', completed: false },
    { id: '7', name: '7', completed: false },
    { id: '8', name: '8', completed: false },
    { id: '9', name: '9', completed: false },
    { id: '10', name: '10', completed: false },
    { id: '20', name: '20', completed: false },
  ],
  family: [
    { id: 'mother', name: 'Mother', completed: false },
    { id: 'father', name: 'Father', completed: false },
    { id: 'sister', name: 'Sister', completed: false },
    { id: 'brother', name: 'Brother', completed: false },
    { id: 'grandmother', name: 'Grandmother', completed: false },
    { id: 'grandfather', name: 'Grandfather', completed: false },
  ],
  greetings: [
    { id: 'hello', name: 'Hello', completed: false },
    { id: 'goodbye', name: 'Goodbye', completed: false },
    { id: 'thank-you', name: 'Thank You', completed: false },
    { id: 'please', name: 'Please', completed: false },
    { id: 'sorry', name: 'Sorry', completed: false },
    { id: 'welcome', name: 'Welcome', completed: false },
  ],
  medical: [
    { id: 'doctor', name: 'Doctor', completed: false },
    { id: 'hospital', name: 'Hospital', completed: false },
    { id: 'medicine', name: 'Medicine', completed: false },
    { id: 'pain', name: 'Pain', completed: false },
    { id: 'sick', name: 'Sick', completed: false },
    { id: 'healthy', name: 'Healthy', completed: false },
  ],
};

const subcategoryTitles = {
  alphabets: 'Alphabets',
  numbers: 'Numbers',
  family: 'Family',
  greetings: 'Greetings',
  medical: 'Medical Terms',
};

export default function SubcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const subcategory = params.subcategory as string;

  const items = itemsData[subcategory as keyof typeof itemsData] || [];
  const subcategoryTitle = subcategoryTitles[subcategory as keyof typeof subcategoryTitles] || subcategory;

  const handleItemClick = (itemId: string) => {
    router.push(`/learning-path/${category}/${subcategory}/${itemId}`);
  };

  const handleBackClick = () => {
    router.push(`/learning-path/${category}`);
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

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
            {subcategoryTitle}
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Select an item to start learning
          </p>
          <div className="text-sm text-muted-foreground">
            Progress: {completedCount}/{totalCount} completed
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-2 max-w-xs mx-auto">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                item.completed 
                  ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                  : 'border-2 hover:border-primary/50'
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  item.completed 
                    ? 'bg-green-500' 
                    : 'bg-secondary'
                }`}>
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className="font-bold text-foreground">{item.name}</span>
                  )}
                </div>
                <div className={`text-sm font-medium ${
                  item.completed ? 'text-green-700 dark:text-green-300' : 'text-foreground'
                }`}>
                  {item.name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push(`/learning-path/${category}/${subcategory}/quiz`)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
            disabled={completedCount === 0}
          >
            Take Quiz ({completedCount > 0 ? 'Available' : 'Complete lessons first'})
          </Button>
        </div>
      </div>
    </div>
  );
}