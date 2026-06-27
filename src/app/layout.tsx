import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindEase | Student Mental Wellness Companion",
  description: "A generative AI-powered wellness companion for students preparing for high-stakes exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased bg-[var(--color-bg)] text-[var(--color-text-primary)]`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
