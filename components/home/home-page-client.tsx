'use client';

import PageHeader from "@/components/common/page-header";
import { useUserData } from "@/contexts/user-data-provider";

export default function HomePageClient() {
  const { user } = useUserData();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0]}!`}
        subtitle="Ready to make healthy choices today?"
      />
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">Your dashboard will appear here.</p>
        <p className="text-muted-foreground">You can start by scanning a product.</p>
      </div>
    </div>
  );
}
