'use client';

import { useState, useEffect } from 'react';
import { PathwayCard } from './PathwayCard';
import TaskDiscovery from './TaskDiscovery';

interface PathwayDiscoveryProps {
    pathways: any[];
    allTasks: any[];
}

export default function PathwayDiscovery({ pathways, allTasks }: PathwayDiscoveryProps) {
    const [viewMode, setViewMode] = useState<'pathways' | 'all'>('pathways');

    return (
        <div className="w-full max-w-[1400px] mx-auto py-8 px-4 font-sans">
            {/* Page Header */}
            <div className="flex flex-col items-center mb-12 text-center">
                <h1 className="text-white text-5xl md:text-6xl font-black mb-4 tracking-tight">
                    Your Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Journey</span>
                </h1>
                <p className="text-neutral-500 text-lg max-w-2xl">
                    Master programming step-by-step. Choose a specialized path or explore all challenges at once.
                </p>
            </div>

            {/* View Switcher */}
            <div className="flex justify-center mb-12">
                <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-2xl flex gap-1">
                    <button
                        onClick={() => setViewMode('pathways')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                            viewMode === 'pathways' 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        Learning Paths
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                            viewMode === 'all' 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        All Tasks
                    </button>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'pathways' ? (
                <div className="space-y-4">
                    {pathways.map((pathway) => (
                        <PathwayCard key={pathway.id} pathway={pathway} />
                    ))}
                    
                    {/* Placeholder for "Uncategorized" or "More coming soon" */}
                    <div className="p-12 border-2 border-dashed border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-neutral-400 font-bold">More paths coming soon</h3>
                        <p className="text-neutral-600 text-sm">We are preparing new challenges for you.</p>
                    </div>
                </div>
            ) : (
                <TaskDiscovery initialTasks={allTasks} />
            )}
        </div>
    );
}
