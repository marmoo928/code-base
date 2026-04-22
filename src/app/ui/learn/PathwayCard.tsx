'use client';

import React from 'react';
import { TaskListItem } from '@/ui/TaskListItem';

interface PathwayCardProps {
    pathway: {
        id: string;
        name: string;
        description: string | null;
        progress: number;
        tasks: any[];
    };
}

export const PathwayCard: React.FC<PathwayCardProps> = ({ pathway }) => {
    const isCompleted = pathway.progress === 100;

    return (
        <div className="bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-neutral-800 overflow-hidden mb-12 shadow-2xl transition-all duration-300 hover:border-neutral-700">
            {/* Header / Banner */}
            <div className={`p-8 border-b border-neutral-800 bg-gradient-to-r ${isCompleted ? 'from-green-500/10 to-emerald-500/10' : 'from-blue-500/10 to-indigo-500/10'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isCompleted ? 'bg-green-500 text-black' : 'bg-blue-500 text-white'}`}>
                                {isCompleted ? 'Completed' : 'Learning Path'}
                            </span>
                            <h2 className="text-3xl font-bold text-white">{pathway.name}</h2>
                        </div>
                        <p className="text-neutral-400 max-w-2xl">{pathway.description}</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 bg-black/30 p-4 rounded-2xl border border-white/5 min-w-[120px]">
                        <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-neutral-800"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={176}
                                    strokeDashoffset={176 - (176 * pathway.progress) / 100}
                                    className={`${isCompleted ? 'text-green-500' : 'text-blue-500'} transition-all duration-1000 ease-out`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{Math.round(pathway.progress)}%</span>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest">Progress</span>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="p-4 sm:p-8 bg-black/20">
                <div className="space-y-4">
                    {pathway.tasks.map((task, idx) => (
                        <TaskListItem key={task.id} task={{ ...task, displayIndex: idx + 1 }} />
                    ))}
                </div>
            </div>
        </div>
    );
};
