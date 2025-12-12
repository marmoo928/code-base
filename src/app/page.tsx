import React from 'react';
import type { Metadata } from 'next'; // Import Metadata type
import Link from 'next/link'; // Use next/link for client-side navigation
import FeatureCard from '@/ui/FeatureCard';

/**
 * Define specific metadata for the homepage.
 */
export const metadata: Metadata = {
  title: 'CODEBASE | Master Competitive Programming and Algorithms',
  description: 'Your dedicated platform for competitive programming. Challenge yourself with real-world algorithms and data structures to level up your engineering skills.',
  keywords: ['competitive programming', 'algorithms', 'data structures', 'coding challenges'],
};

/**
 * The Root Home Page (URL: /)
 * This is a Server Component, focusing on static, marketing content.
 */
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-8 text-center min-h-[70vh]">
      
      {/* Hero Title */}
      <h1 className="text-6xl sm:text-7xl font-extrabold text-white mb-6 leading-tight">
        Master Code, Build Mastery
      </h1>
      
      {/* Subtitle/Description */}
      <p className="text-xl sm:text-2xl text-stone-300 mb-12 max-w-3xl">
        CODEBASE is your dedicated platform for competitive programming. Challenge yourself with real-world algorithms and data structures to level up your engineering skills.
      </p>
      
      {/* Primary Call to Action - Using Next.js Link */}
      <Link 
        href="/learn" 
        className="
          px-10 py-4 bg-green-500 text-black text-xl sm:text-2xl font-bold 
          rounded-xl shadow-lg 
          hover:bg-green-400 transition-colors duration-300 
          transform hover:scale-[1.02] active:scale-95
        "
      >
        Start Solving Challenges Now →
      </Link>
      
      {/* Feature Highlight Section */}
      <div className="mt-24 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Challenge Library" 
          description="Access a growing database of tasks across all difficulty levels and categories." 
          icon="📚"
        />
        <FeatureCard 
          title="Real-time Stats" 
          description="Track your progress, XP, and global ranking to stay motivated." 
          icon="📈"
        />
        <FeatureCard 
          title="Structured Learning" 
          description="Follow curated paths from basic syntax to advanced concurrency concepts." 
          icon="🗺️"
        />
      </div>
    </div>
  );
};

export default HomePage;