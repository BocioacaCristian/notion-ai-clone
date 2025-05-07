import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "This platform has completely transformed how our team collaborates on projects.",
    author: "Alex Chen",
    role: "Product Manager, Acme Inc."
  },
  {
    quote: "The AI features save me hours every week on writing and content creation.",
    author: "Sarah Johnson",
    role: "Content Strategist, TechCorp"
  },
  {
    quote: "I've tried many productivity tools, but this one strikes the perfect balance of power and simplicity.",
    author: "Michael Rodriguez",
    role: "Freelance Designer"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">What people are saying</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of teams and individuals to organize their work and boost productivity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-card/30 p-6 rounded-xl border border-border/30 shadow-sm backdrop-blur-sm"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 