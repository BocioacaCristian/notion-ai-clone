import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Showcase() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            Start with a template. Build anything.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Jumpstart your workflow with ready-made templates for any use case.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemplateCard 
            title="Company Wiki"
            icon="📘"
            href="/templates/wiki"
          />
          
          <TemplateCard 
            title="Project Roadmap"
            icon="🛣️"
            href="/templates/roadmap"
          />
          
          <TemplateCard 
            title="OKRs"
            icon="🎯"
            href="/templates/okrs"
          />
          
          <TemplateCard 
            title="Meeting Notes"
            icon="📝"
            href="/templates/meeting-notes"
          />
          
          <TemplateCard 
            title="Content Calendar"
            icon="📅"
            href="/templates/calendar"
          />
          
          <TemplateCard 
            title="Habit Tracker"
            icon="✅"
            href="/templates/habit-tracker"
          />
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/templates">
            <Button variant="outline" className="group">
              Browse all templates
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface TemplateCardProps {
  title: string;
  icon: string;
  href: string;
}

function TemplateCard({ title, icon, href }: TemplateCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/20 shadow-sm hover:shadow-md transition-all">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center text-sm text-primary/80 group-hover:text-primary transition-colors">
          <span>View template</span>
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
} 