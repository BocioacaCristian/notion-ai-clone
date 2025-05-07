import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            The happier
            <br />
            workspace
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-7 text-muted-foreground">
            Write. Plan. Collaborate. With a little help from AI.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 shadow-md hover:shadow-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="px-8 group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <p className="mt-3 text-sm text-muted-foreground">
            No credit card required
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-tl from-primary/5 to-background shadow-xl shadow-primary/10 ring-1 ring-primary/10"></div>
    </div>
  );
} 