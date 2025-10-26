// src/app/onboarding/page.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/page-header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';
import { Barcode, User, Sparkles } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Barcode,
    title: "Scan & Discover",
    description: "Scan barcodes to instantly get detailed product information, from ingredients to nutritional values.",
    image: "https://picsum.photos/seed/onboard1/400/300",
    imageHint: "phone scanning barcode",
  },
  {
    icon: User,
    title: "Personalize Your Profile",
    description: "Tell us about your allergies, dietary needs, and health goals for a truly customized experience.",
    image: "https://picsum.photos/seed/onboard2/400/300",
    imageHint: "person selecting preferences",
  },
  {
    icon: Sparkles,
    title: "Get AI-Powered Insights",
    description: "Receive smart, simple, and personalized advice on whether a product is right for you.",
    image: "https://picsum.photos/seed/onboard3/400/300",
    imageHint: "AI robot analyzing food",
  },
];


export default function OnboardingPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center bg-background px-6">
      <div className="text-center mb-8">
        <PageHeader
          title="Welcome to HealthScan Pro"
          subtitle="Your guide to healthier shopping."
        />
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {onboardingSteps.map((step, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 gap-4 text-center">
                     <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                        {/* --- CORRECCIÓN AQUÍ --- */}
                        <Image
                            src={step.image}
                            alt={step.title}
                            width={400}
                            height={300}
                            className="object-cover w-full h-full"
                            data-ai-hint={step.imageHint} />
                        {/* --- FIN CORRECCIÓN --- */}
                     </div>
                     <step.icon className="h-8 w-8 text-primary mt-2" />
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>


      <div className="flex flex-col gap-4 mt-8 pb-4">
        <Button asChild size="lg">
          <Link href="/signup">Get Started</Link>
        </Button>
        <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
                Log In
            </Link>
        </div>
      </div>
    </div>
  );
}