'use client';

import Link from 'next/link';
import PageHeader from '@/components/common/page-header';
import AllergenManager from '@/components/profile/allergen-manager';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild className="-ml-4">
            <Link href="/profile">
                <ChevronLeft />
            </Link>
            </Button>
            <PageHeader title="Settings & Preferences" />
        </div>

      <Card>
        <CardHeader>
          <CardTitle>My Allergens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Select any ingredients you are allergic to. This will help us warn you about unsuitable products.</p>
          <AllergenManager />
        </CardContent>
      </Card>

      {/* Other settings can be added here */}
    </div>
  );
}
