'use client';

import React from 'react';
import { TodoTemplates } from '@/components/Todo/TodoTemplates';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TemplatesPage() {
  return (
    <div className="container py-10">
      <Link href="/todos">
        <Button variant="outline" size="sm" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lists
        </Button>
      </Link>
      
      <TodoTemplates />
    </div>
  );
} 