import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion AI Clone",
  description: "A simplified version of Notion AI with rich text editing and AI features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
          {children}
          <Toaster position="bottom-right" />
        </main>
      </body>
    </html>
  );
}
