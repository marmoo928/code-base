// ui/learn/AppliedSortTags.tsx

interface AppliedSortTagsProps {
    sortKey: 'difficulty' | 'status' | 'none';
    sortOrder: 'asc' | 'desc';
    statusCycle: 1 | 2 | 3;
    onClearSort: () => void;
    onToggleOrder: () => void;
}

const ICONS = {
    orderAsc: '↑',
    orderDesc: '↓',
    solved: '✅',
    notSolved: '❌',
    inProgress: '✏️',
};

const getSortLabel = (key: 'difficulty' | 'status', order: 'asc' | 'desc', cycle: 1 | 2 | 3) => {
    const arrow = key === 'difficulty' ? (order === 'asc' ? ICONS.orderAsc : ICONS.orderDesc) : '';

    if (key === 'difficulty') {
        return `Difficulty ${arrow}`;
    }

    let cycleIcon = ''; 
    if (cycle === 1) cycleIcon = ICONS.inProgress;
    else if (cycle === 2) cycleIcon = ICONS.solved;
    else if (cycle === 3) cycleIcon = ICONS.notSolved;

    return `Status: ${cycleIcon}`;
}


export const AppliedSortTags = ({ sortKey, sortOrder, statusCycle, onClearSort, onToggleOrder }: AppliedSortTagsProps) => {
    if (sortKey === 'none') {
        return null; 
    }

    const sortLabel = getSortLabel(sortKey, sortOrder, statusCycle);

    return (
        <div className="flex items-center gap-3 text-neutral-400">
            <span className="font-semibold whitespace-nowrap">Applied Sort:</span>
            
            <div 
                onClick={onToggleOrder}
                tabIndex={0}
                role="button" 
                aria-label={`Toggle ${sortKey} sort order`}
                className="
                    flex items-center gap-2 
                    bg-transparent border border-neutral-600 
                    rounded-lg py-2 px-4 text-base text-neutral-200 
                    cursor-pointer // Retain visual cursor
                    hover:bg-neutral-800 transition-colors
                "
            >
                <span className="font-medium">
                    {sortLabel} 
                </span>
                
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onClearSort();
                    }}
                    className="
                        text-neutral-400 hover:text-red-400 
                        transition-colors text-lg font-bold leading-none
                        p-0 m-0 border-none bg-transparent // Ensure button styling is minimal/invisible
                    "
                    aria-label={`Clear Sort`}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};