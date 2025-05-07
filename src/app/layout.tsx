import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Notion AI",
  description: "Professional document editor with AI-powered writing features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-background via-background to-background/90`}>
        <main className="min-h-screen text-foreground overflow-hidden">
          {children}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: { 
                background: 'var(--color-card)', 
                color: 'var(--color-foreground)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
                fontSize: '0.875rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '0.375rem'
              },
            }}
          />
        </main>
      </body>
    </html>
  );
}
