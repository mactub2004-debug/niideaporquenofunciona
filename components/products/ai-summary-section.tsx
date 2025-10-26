'use client';

import React, { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/contexts/user-data-provider';
import SuitabilityBadge from './suitability-badge';
import { getSuitability } from '@/lib/utils';
import Link from 'next/link';

interface AnalysisResult {
  score: number;
  rating: string;
  summary: string;
}

export default function AiSummarySection({ product }: { product: Product }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserData();
  const { toast } = useToast();
  
  const suitability = getSuitability(product, user?.allergies || []);

  const handleGenerateSummary = async () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Required',
            description: 'You must be logged in to get a personalized analysis.',
        });
        return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, user: user }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get analysis from server.');
      }
      
      const data: AnalysisResult = await response.json();
      setAnalysis(data);

    } catch (error: any) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not generate AI summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset analysis when product changes
    setAnalysis(null);
  }, [product]);


  if (!user) {
    return (
        <div className="space-y-2 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> General Rating</h3>
            <SuitabilityBadge suitability={suitability} />
            <p className="text-xs text-muted-foreground pt-2">
                <Link href="/login" className="underline text-primary">Log in</Link> or <Link href="/signup" className="underline text-primary">create an account</Link> to get a personalized AI analysis based on your health goals and allergies.
            </p>
        </div>
    )
  }

  if (analysis) {
    return (
      <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-md">
          <div className="flex">
              <div className="flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                  <h3 className="text-sm font-semibold text-primary">
                    AI Personalized Analysis
                  </h3>
                  <div className="mt-2 text-sm text-primary/90 space-y-2">
                      <p>{analysis.summary}</p>
                      <div className="flex items-baseline gap-2 pt-1">
                        <p className="text-2xl font-bold text-foreground">{analysis.score}<span className="text-base font-normal text-muted-foreground">/100</span></p>
                        <p className="font-semibold text-foreground">{analysis.rating}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }
  
  return (
    <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full">
        {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
            <Sparkles className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Generating...' : 'Generate Personalized AI Summary'}
    </Button>
  );
}