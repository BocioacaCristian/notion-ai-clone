import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-20 bg-primary/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Get a brain boost.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built right into your workspace, our AI is ready to brainstorm,
            summarize, help you write, and find what you're looking for.
          </p>
          
          <div className="mt-10">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 shadow-md group">
                Try It Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-primary/5">
        <div className="absolute bottom-10 left-0 h-60 w-60 rounded-full bg-gradient-to-tr from-primary/10 to-primary/5 blur-3xl"></div>
        <div className="absolute top-10 right-0 h-60 w-60 rounded-full bg-gradient-to-bl from-primary/10 to-primary/5 blur-3xl"></div>
      </div>
    </section>
  );
} 