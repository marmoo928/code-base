// /app/statistics/page.tsx

'use client';

import { useState } from 'react';
import { tasks } from '../lib/placeholder-data';
import { TabNavigation } from '../ui/statistics/TabNavigation';
import { StatisticsTab } from '../ui/statistics/Statistics';
import { SolutionsTab } from '../ui/statistics/Solutions';

type TabType = 'statistics' | 'solutions';

export default function StatisticsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('statistics');
    const totalTasks = tasks.length;
    const solvedTasks = tasks.filter(t => t.status === 'Solved').length;
    const solvedPercentage = totalTasks > 0 ? ((solvedTasks / totalTasks) * 100).toFixed(1) : '0';
    const totalXP = tasks.filter(t => t.status === 'Solved').reduce((sum, task) => sum + task.xp, 0);
    const successRate = solvedTasks > 0 ? '100' : '0';
    
    const getLevel = (xp: number) => {
        if (xp === 0) return 'Beginner';
        if (xp < 50) return 'Rookie Coder';
        if (xp < 150) return 'Intermediate';
        if (xp < 300) return 'Advanced';
        return 'Expert';
    };
    
    const topTags = tasks
        .filter(t => t.status === 'Solved')
        .flatMap(t => t.tags)
        .reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    
    const sortedTags = Object.entries(topTags)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag);

    const solvedTasksList = tasks.filter(t => t.status === 'Solved');

    const level = getLevel(totalXP);

    return (
        <div className="min-h-screen text-stone-300 p-8">
            
            <TabNavigation 
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            {activeTab === 'statistics' ? (
                <StatisticsTab
                    totalTasks={totalTasks}
                    solvedTasks={solvedTasks}
                    solvedPercentage={solvedPercentage}
                    totalXP={totalXP}
                    level={level}
                    successRate={successRate}
                    sortedTags={sortedTags}
                />
            ) : (
                <SolutionsTab
                    solvedTasksList={solvedTasksList}
                />
            )}
        </div>
    );
}