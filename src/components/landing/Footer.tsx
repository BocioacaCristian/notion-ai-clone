import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const companyLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Terms & Privacy', href: '/legal' }
];

const resourceLinks = [
  { label: 'Help center', href: '/help' },
  { label: 'Community', href: '/community' },
  { label: 'Templates', href: '/templates' },
  { label: 'Integrations', href: '/integrations' }
];

const productLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Documents', href: '/documents' },
  { label: 'Todos', href: '/todos' },
  { label: 'AI Assistant', href: '/ai/generate' }
];

export function Footer() {
  return (
    <footer className="bg-card/20 border-t border-border/10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and socials */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold text-lg">P</div>
              <span className="text-lg font-semibold">ProDoc</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              All-in-one workspace for your notes, tasks, and documents.
            </p>
            
            <div className="flex space-x-4">
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} label="Facebook" />
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} label="Instagram" />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="https://github.com" icon={<Github size={18} />} label="GitHub" />
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/10">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} ProDoc, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
} 