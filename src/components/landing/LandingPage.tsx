import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { Showcase } from './Showcase';
import { Testimonials } from './Testimonials';
import { CallToAction } from './CallToAction';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Showcase />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
} 