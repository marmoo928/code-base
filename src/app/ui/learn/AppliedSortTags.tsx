// ui/learn/AppliedSortTags.tsx

interface AppliedSortTagsProps {
    difficultySort: 'asc' | 'desc' | 'none';
    statusSort: number | 'none'; // Using number for cycle
    selectedTags: string[];
    onClearDifficulty: () => void;
    onClearStatus: () => void;
    onRemoveTag: (tag: string) => void;
    onClearAll: () => void;
    onToggleDifficulty: () => void;
    onToggleStatus: () => void;
}

const ICONS = {
    orderAsc: '↑',
    orderDesc: '↓',
    solved: '✅',
    notSolved: '❌',
    inProgress: '✏️',
};

export const AppliedSortTags = ({ 
    difficultySort, 
    statusSort, 
    selectedTags,
    onClearDifficulty, 
    onClearStatus,
    onRemoveTag,
    onClearAll,
    onToggleDifficulty,
    onToggleStatus 
}: AppliedSortTagsProps) => {
    const hasFilters = difficultySort !== 'none' || statusSort !== 'none' || selectedTags.length > 0;

    if (!hasFilters) {
        return null; 
    }

    return (
        <div className="flex flex-wrap items-center gap-3 text-neutral-400">
            <span className="font-semibold whitespace-nowrap">Active Filters:</span>
            
            {/* Status Sort Tag */}
            {statusSort !== 'none' && (
                <div 
                    onClick={onToggleStatus}
                    className="flex items-center gap-2 bg-neutral-800/80 border border-neutral-700 rounded-lg py-1.5 px-3 text-sm text-neutral-200 cursor-pointer hover:bg-neutral-700 transition-colors"
                >
                    <span className="font-medium">
                        Status: {statusSort === 1 ? ICONS.inProgress : statusSort === 2 ? ICONS.solved : ICONS.notSolved}
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClearStatus();
                        }}
                        className="text-neutral-500 hover:text-red-400 font-bold transition-colors ml-1"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Difficulty Sort Tag */}
            {difficultySort !== 'none' && (
                <div 
                    onClick={onToggleDifficulty}
                    className="flex items-center gap-2 bg-neutral-800/80 border border-neutral-700 rounded-lg py-1.5 px-3 text-sm text-neutral-200 cursor-pointer hover:bg-neutral-700 transition-colors"
                >
                    <span className="font-medium">
                        Difficulty {difficultySort === 'asc' ? ICONS.orderAsc : ICONS.orderDesc}
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClearDifficulty();
                        }}
                        className="text-neutral-500 hover:text-red-400 font-bold transition-colors ml-1"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Tag Filters */}
            {selectedTags.map(tag => (
                <div 
                    key={tag}
                    className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg py-1.5 px-3 text-sm text-blue-300 font-medium"
                >
                    <span>{tag}</span>
                    <button 
                        onClick={() => onRemoveTag(tag)}
                        className="text-blue-500 hover:text-red-400 font-bold transition-colors ml-1"
                    >
                        &times;
                    </button>
                </div>
            ))}

            {/* Clear All Button */}
            <button 
                onClick={onClearAll}
                className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors ml-2"
            >
                Clear All
            </button>
        </div>
    );
};