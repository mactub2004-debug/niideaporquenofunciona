'use client';
import PageHeader from '@/components/common/page-header';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Search Products" />
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search for products or brands..." className="pl-10" />
            </div>
            {/* Search results will be displayed here */}
             <div className="text-center py-20 flex flex-col items-center">
                <SearchIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold">Search for products</h3>
                <p className="text-muted-foreground mt-2">Find your favorite items quickly.</p>
            </div>
        </div>
    )
}
