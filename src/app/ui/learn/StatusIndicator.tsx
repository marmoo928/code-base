// ui/learn/StatusIndicator.tsx

interface StatusIndicatorProps {
    cycle: 1 | 2 | 3;
    isActive: boolean;
}

const getStatusDetails = (cycle: 1 | 2 | 3) => {
    if (cycle === 1) return { content: '✏️', color: 'text-blue-400' }; // In Progress first
    if (cycle === 2) return { content: '✅', color: 'text-green-400' }; // Solved first
    if (cycle === 3) return { content: '❌', color: 'text-red-400' }; // Not Solved first
    return { content: '', color: '' };
}

export const StatusIndicator = ({ cycle, isActive }: StatusIndicatorProps) => {
    if (!isActive) return null;

    const { content, color } = getStatusDetails(cycle);
    
    return (
        <span className={`ml-auto ${color} font-bold text-lg`}>
            {content}
        </span>
    );
}