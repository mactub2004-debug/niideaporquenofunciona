'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/page-header';
import AllergenManager from '@/components/profile/allergen-manager';
import DietManager from '@/components/profile/diet-manager';
import HealthGoalsManager from '@/components/profile/health-goals-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const steps = [
  {
    title: 'My Allergens',
    description: "Select any ingredients you are allergic to. This will help us warn you about unsuitable products.",
    component: <AllergenManager />,
  },
  {
    title: 'My Diet',
    description: "Select your dietary preferences to help us filter products.",
    component: <DietManager />,
  },
  {
    title: 'My Health Goals',
    description: "What are you trying to achieve? We'll help you get there.",
    component: <HealthGoalsManager />,
  },
];

export default function AllergySelectionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish setup and redirect
      router.push('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const progressValue = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center bg-background px-6 space-y-6">
      <div className="text-center flex flex-col items-center">
        <PageHeader 
          title="Customize Your Filters" 
          subtitle="This will help us personalize your experience."
        />
      </div>

      <Progress value={progressValue} className="w-full" />

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentStepData.title}
          </CardTitle>
          <CardDescription>
            {currentStepData.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentStepData.component}
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full gap-4 pb-4">
        {currentStep > 0 && (
          <Button onClick={handleBack} variant="outline" className="w-1/4">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <Button onClick={handleNext} size="lg" className="flex-1">
            {currentStep === steps.length - 1 ? 'Finish Setup' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
