import React from 'react';
import type { Metadata } from 'next'; // Import Metadata type
import Link from 'next/link'; // Use next/link for client-side navigation
import FeatureCard from '@/ui/FeatureCard';


export const metadata: Metadata = {
  title: 'CODEBASE | Learn Programming Through Practice',
  description: 'An interactive learning platform for students and beginners. Master programming fundamentals, algorithms, and data structures through hands-on coding exercises and challenges.',
  keywords: ['learn programming', 'coding education', 'programming exercises', 'algorithm learning', 'computer science education', 'coding for students'],
};


const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-8 text-center min-h-[70vh]">
      
      <h1 className="text-6xl sm:text-7xl font-extrabold text-white mb-6 leading-tight">
        Master Code, Build Skills
      </h1>
      
      <p className="text-xl sm:text-2xl text-stone-300 mb-12 max-w-3xl">
        CODEBASE is your interactive learning platform for programming. Practice with real exercises, learn algorithms and data structures, and build strong coding foundations.
      </p>
      
      <Link 
        href="/learn" 
        className="
          px-10 py-4 bg-green-500 text-black text-xl sm:text-2xl font-bold 
          rounded-xl shadow-lg 
          hover:bg-green-400 transition-colors duration-300 
          transform hover:scale-[1.02] active:scale-95
        "
      >
        Start Learning Now →
      </Link>
      
      <div className="mt-24 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Exercise Library" 
          description="Access a growing collection of programming exercises across all difficulty levels and topics." 
          icon="📚"
        />
        <FeatureCard 
          title="Track Progress" 
          description="Monitor your learning journey with XP points, statistics, and achievement tracking." 
          icon="📈"
        />
        <FeatureCard 
          title="Structured Learning" 
          description="Follow organized paths from basic programming concepts to advanced techniques." 
          icon="🗺️"
        />
      </div>
    </div>
  );
};

export default HomePage;