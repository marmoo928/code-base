// /app/ui/statistics/TabNavigation.tsx

interface TabNavigationProps {
    activeTab: 'statistics' | 'solutions';
    onTabChange: (tab: 'statistics' | 'solutions') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
    return (
        <div className="flex justify-center items-center gap-0 mb-12">
            <button
                onClick={() => onTabChange('statistics')}
                className={`px-6 py-2 text-base font-normal border-b-2 transition-colors ${
                    activeTab === 'statistics'
                        ? 'border-green-500 text-green-500'
                        : 'border-stone-300 text-stone-300 hover:text-green-400'
                }`}
            >
                Statistics
            </button>
            <button
                onClick={() => onTabChange('solutions')}
                className={`px-6 py-2 text-base font-normal border-b-2 transition-colors ${
                    activeTab === 'solutions'
                        ? 'border-green-500 text-green-500'
                        : 'border-stone-300 text-stone-300 hover:text-green-400'
                }`}
            >
                Your solutions
            </button>
        </div>
    );
};