'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Palette, MessageSquare, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = [
  {
    id: 'academic-subjects',
    title: 'Academic Subjects',
    description: 'Learn signs for school subjects, science, and mathematics',
    icon: GraduationCap,
    color: 'bg-blue-500 dark:bg-blue-600',
  },
  {
    id: 'life-skills',
    title: 'Life Skills',
    description: 'Essential signs for daily activities and practical life',
    icon: Palette,
    color: 'bg-green-500 dark:bg-green-600',
  },
  {
    id: 'daily-conversations',
    title: 'Daily Conversations',
    description: 'Common phrases and expressions for everyday communication',
    icon: MessageSquare,
    color: 'bg-purple-500 dark:bg-purple-600',
  },
  {
    id: 'important-vocabulary',
    title: 'Important Vocabulary',
    description: 'Key words and concepts in Indian Sign Language',
    icon: Star,
    color: 'bg-orange-500 dark:bg-orange-600',
  },
];

export default function LearningPathDashboard() {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/learning-path/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ISL Learning Path
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a category to start your Indian Sign Language journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${category.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{category.title}</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Tap to explore
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}