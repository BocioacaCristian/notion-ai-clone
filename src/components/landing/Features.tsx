import React from 'react';
import { 
  Target, 
  Calendar, 
  ListChecks, 
  Sparkles, 
  LayoutGrid, 
  PenLine 
} from 'lucide-react';

const features = [
  {
    title: 'Tasks and to-dos',
    description: 'Tackle any project, big or small.',
    icon: ListChecks,
  },
  {
    title: 'Custom views',
    description: 'Visualize work in any format, from calendars to boards.',
    icon: LayoutGrid,
  },
  {
    title: 'Automations',
    description: 'Put tedious tasks on autopilot.',
    icon: Sparkles,
  },
  {
    title: 'AI-assisted',
    description: 'Edit, draft, translate. Your trusted AI assistant is here.',
    icon: PenLine,
  },
  {
    title: 'Calendar',
    description: 'See all your commitments in one place.',
    icon: Calendar,
  },
  {
    title: 'Goal tracking',
    description: "Track progress toward what's most important.",
    icon: Target,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Your workflow. Your way.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            All your projects, goals, calendars, roadmaps, and more—in one
            tool—personalized to how you and your team work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 