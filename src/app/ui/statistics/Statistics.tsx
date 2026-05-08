// /app/ui/statistics/StatisticsTab.tsx

import FeatureCard from '@/ui/FeatureCard';

interface StatisticsTabProps {
    totalTasks: number;
    solvedTasks: number;
    solvedPercentage: string;
    totalXP: number;
    level: string;
    nextLevelXP: number | null;
    successRate: string;
    sortedTags: string[];
    totalPathways: number;
    completedPathways: number;
}

export const StatisticsTab = ({
    totalTasks,
    solvedTasks,
    solvedPercentage,
    totalXP,
    level,
    nextLevelXP,
    successRate,
    sortedTags,
    totalPathways,
    completedPathways,
}: StatisticsTabProps) => {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-0">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 mb-6 lg:mb-10">
                
                <FeatureCard
                    title="Tasks Solved"
                    description={
                        <div className="flex flex-col items-center mt-3 sm:mt-4">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3">
                                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 80 80">
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        fill="none"
                                        className="text-zinc-600"
                                    />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 36}`}
                                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - parseFloat(solvedPercentage) / 100)}`}
                                        className="text-green-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-green-500 text-xs sm:text-sm font-bold">{solvedPercentage}%</span>
                                </div>
                            </div>
                            <p className="text-neutral-500 text-xs sm:text-sm font-medium">{solvedTasks}/{totalTasks}</p>
                        </div>
                    }
                />

                <FeatureCard
                    title="Your Level"
                    description={
                        <div className="flex flex-col items-center mt-3 sm:mt-4 w-full px-4">
                            <p className="text-green-500 text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1">{totalXP} XP</p>
                            <p className="text-neutral-500 text-xs sm:text-sm font-medium mb-3">{level}</p>
                            
                            {nextLevelXP !== null ? (
                                <div className="w-full flex flex-col items-center">
                                    <div className="w-full bg-zinc-700 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                            style={{ width: `${Math.min((totalXP / nextLevelXP) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-wider">
                                        {nextLevelXP - totalXP} XP to {nextLevelXP === 250 ? 'Apprentice' : nextLevelXP === 500 ? 'Intermediate' : nextLevelXP === 1000 ? 'Advanced' : 'Master'}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-[10px] text-green-500 mt-2 font-bold uppercase tracking-wider">Max Level Reached!</p>
                            )}
                        </div>
                    }
                />

                <FeatureCard
                    title="Success rate"
                    description={
                        <div className="flex flex-col items-center mt-3 sm:mt-4">
                            <p className="text-green-500 text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 sm:mb-3">{successRate} %</p>
                            <p className="text-neutral-500 text-xs sm:text-sm font-medium">
                                {parseFloat(successRate) === 100 ? 'Flawless' : 'Keep going!'}
                            </p>
                        </div>
                    }
                />
            </div>

            <div className="mb-6 lg:mb-10">
                <FeatureCard
                    title="Task completion"
                    description={
                        <div className="mt-3 sm:mt-4">
                            <div className="flex items-center justify-center mb-3 sm:mb-4">
                                <div className="w-full sm:w-3/4 bg-zinc-600 rounded-lg h-12 sm:h-16 lg:h-20 relative overflow-hidden border border-neutral-700">
                                    <div 
                                        className="bg-green-500 h-full rounded-lg transition-all duration-500 border border-green-500"
                                        style={{ width: `${solvedPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-neutral-500 text-xs sm:text-sm font-medium text-center">
                                {solvedTasks}/{totalTasks} ({solvedPercentage}%) exercises completed
                            </p>
                        </div>
                    }
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
                <FeatureCard
                    title="Pathways Completed"
                    description={
                        <div className="flex flex-col items-center mt-3 sm:mt-4">
                            <p className="text-green-500 text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 sm:mb-3">
                                {completedPathways} / {totalPathways}
                            </p>
                            <p className="text-neutral-500 text-xs sm:text-sm font-medium">Learning paths mastered</p>
                        </div>
                    }
                />
                
                <FeatureCard
                    title="Top used categories"
                    description={
                        <div className="flex flex-wrap justify-center items-center gap-2 px-2 sm:px-4 mt-3 sm:mt-4 min-h-[64px] sm:min-h-[80px]">
                            {sortedTags.length > 0 ? (
                                sortedTags.map((tag, index) => (
                                    <div 
                                        key={index}
                                        className="px-3 py-1.5 bg-neutral-800 rounded-lg border border-neutral-600 text-green-400 text-sm font-semibold uppercase tracking-wide"
                                    >
                                        {tag}
                                    </div>
                                ))
                            ) : (
                                <p className="text-neutral-500 text-xs sm:text-sm font-medium">No tags yet.</p>
                            )}
                        </div>
                    }
                />
            </div>
        </div>
    );
};