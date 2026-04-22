'use client';

import { useState, useMemo } from 'react';
import { TaskListHeader } from "@/ui/TaskListHeader";
import { TaskListItem } from "@/ui/TaskListItem";
import { SortButton } from "@/ui/learn/SortByMenu";
import { AppliedSortTags } from "@/ui/learn/AppliedSortTags";

type SortKey = 'difficulty' | 'status' | 'none';
type SortOrder = 'asc' | 'desc';
type StatusSortCycle = 1 | 2 | 3;

// Adapt to database task structure
interface TaskDiscoveryProps {
    initialTasks: any[];
}

export default function TaskDiscovery({ initialTasks }: TaskDiscoveryProps) {
    const [difficultySort, setDifficultySort] = useState<SortOrder | 'none'>('none');
    const [statusSort, setStatusSort] = useState<StatusSortCycle | 'none'>('none');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const sortedTasks = useMemo(() => {
        let result = [...initialTasks];

        // 0. Filtering by search query
        if (searchQuery) {
            result = result.filter(task => 
                task.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 1. Filtering by tags
        if (selectedTags.length > 0) {
            result = result.filter(task => 
                selectedTags.every(tag => task.tags.includes(tag))
            );
        }

        // 2. Multi-level Sorting
        result.sort((a, b) => {
            // Apply status sort first if active
            if (statusSort !== 'none') {
                const getStatusOrder = (cycle: StatusSortCycle): Record<string, number> => {
                    if (cycle === 1) return { 'In progress': 1, 'Not solved': 2, 'Solved': 3 };
                    if (cycle === 2) return { 'Solved': 1, 'Not solved': 2, 'In progress': 3 };
                    if (cycle === 3) return { 'Not solved': 1, 'In progress': 2, 'Solved': 3 };
                    return { 'In progress': 1, 'Not solved': 2, 'Solved': 3 };
                };
                const statusOrder = getStatusOrder(statusSort);
                const aOrder = statusOrder[a.status] || 99;
                const bOrder = statusOrder[b.status] || 99;
                
                if (aOrder !== bOrder) return aOrder - bOrder;
            }

            // Then apply difficulty sort if active
            if (difficultySort !== 'none') {
                const comparison = a.difficulty - b.difficulty;
                return difficultySort === 'asc' ? comparison : -comparison;
            }

            return 0;
        });

        return result;
    }, [difficultySort, statusSort, selectedTags, initialTasks, searchQuery]);

    const handleSortAction = (key: 'difficulty' | 'status') => {
        if (key === 'difficulty') {
            setDifficultySort(prev => {
                if (prev === 'none') return 'asc';
                if (prev === 'asc') return 'desc';
                return 'asc'; // Only toggle asc <-> desc
            });
        } else if (key === 'status') {
            setStatusSort(prev => {
                if (prev === 'none') return 1;
                if (prev === 3) return 1; // Cycle 1 -> 2 -> 3 -> 1
                return (prev + 1) as StatusSortCycle;
            });
        }
    };

    const handleClearSort = () => {
        setDifficultySort('none');
    };

    const handleClearStatus = () => {
        setStatusSort('none');
    };

    const handleTagClick = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tagToRemove));
    };

    const handleClearAll = () => {
        setDifficultySort('none');
        setStatusSort('none');
        setSelectedTags([]);
        setSearchQuery("");
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto py-8">
            <div className="flex justify-center mb-8">
                <h1 className="text-white text-5xl font-bold border-3 border-neutral-500 rounded-lg px-10 py-6">
                    Tasks to solve
                </h1>
            </div>
            <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text"
                        placeholder="Find a challenge by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <SortButton
                        onSortChange={handleSortAction}
                        difficultySort={difficultySort}
                        statusSort={statusSort}
                    />

                    <AppliedSortTags
                        difficultySort={difficultySort}
                        statusSort={statusSort}
                        selectedTags={selectedTags}
                        onClearDifficulty={() => setDifficultySort('none')}
                        onClearStatus={() => setStatusSort('none')}
                        onRemoveTag={handleRemoveTag}
                        onClearAll={handleClearAll}
                        onToggleDifficulty={() => handleSortAction('difficulty')}
                        onToggleStatus={() => handleSortAction('status')}
                    />
                </div>
            </div>

            <TaskListHeader />
            <ul className="space-y-4">
                {sortedTasks.map((task, index) => (
                    <TaskListItem 
                        key={task.id} 
                        task={{ ...task, displayIndex: index + 1 }} 
                        onTagClick={handleTagClick}
                    />
                ))}
            </ul>
        </div>
    );
}
