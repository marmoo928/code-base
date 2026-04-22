// ui/learn/SortButton.tsx

'use client'; 

import { useState, useRef, useEffect } from 'react';

const CONTAINER_WIDTH_CLASS = 'w-full md:w-[340px]'; 
const BUTTON_HEIGHT_CLASS = 'h-[71px]';
const BORDER_CLASS = 'border border-neutral-600';
const BG_DARK_GRAY = 'bg-[#5B5B5B]';
const BG_BLACK = 'bg-black';
const INNER_PADDING_CLASS = 'p-3'; 
const MENU_PADDING_CLASS = 'p-3'; 
const BUTTON_TRANSITION_DURATION = 50; 
const MENU_TRANSITION_DURATION = 50; 

interface SortButtonProps {
    onSortChange: (key: 'difficulty' | 'status') => void;
    difficultySort: 'asc' | 'desc' | 'none';
    statusSort: number | 'none';
}

const BUTTON_BASE_STYLE_CLASSES = `
  flex ${BUTTON_HEIGHT_CLASS} justify-center items-center gap-2 
  ${BG_DARK_GRAY} text-white text-2xl font-semibold 
  cursor-pointer w-full ${INNER_PADDING_CLASS} 
  transition-all duration-[50ms] ease-in-out
`;

const DROPDOWN_ITEM_BASE_STYLE = `
  py-2 px-4 cursor-pointer hover:bg-neutral-800 rounded-lg
  text-white text-xl font-medium
`;

const DifficultyIndicator = ({ sort }: { sort: 'asc' | 'desc' | 'none' }) => {
    if (sort === 'none') return null;
    const arrow = sort === 'asc' ? '↑' : '↓'; 
    return (
        <span className={`ml-auto text-yellow-400 font-bold text-lg`}>
            {arrow}
        </span>
    );
}

const StatusIndicator = ({ sort }: { sort: number | 'none' }) => {
    if (sort === 'none') return null;
    let indicatorContent: string;
    let colorClass: string = 'text-yellow-400';
    if (sort === 1) { indicatorContent = '✏️'; colorClass = 'text-blue-400'; } 
    else if (sort === 2) { indicatorContent = '✅'; colorClass = 'text-green-400'; } 
    else { indicatorContent = '❌'; colorClass = 'text-red-400'; }
    return (
        <span className={`ml-auto ${colorClass} font-bold text-lg`}>
            {indicatorContent}
        </span>
    );
}

export const SortButton = ({ onSortChange, difficultySort, statusSort }: SortButtonProps) => {
    const [buttonIsOpen, setButtonIsOpen] = useState(false);
    const [showMenuContent, setShowMenuContent] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        if (!showMenuContent) {
            setButtonIsOpen(true);
            setIsHovered(false);
            setTimeout(() => setShowMenuContent(true), BUTTON_TRANSITION_DURATION);
        } else {
            setShowMenuContent(false);
            setTimeout(() => setButtonIsOpen(false), MENU_TRANSITION_DURATION);
        }
    };

    const handleSortClick = (e: React.MouseEvent, key: 'difficulty' | 'status') => {
        e.stopPropagation(); // Prevent closing when clicking items
        onSortChange(key);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(event.target as Node) && showMenuContent) {
                setShowMenuContent(false);
                setTimeout(() => setButtonIsOpen(false), MENU_TRANSITION_DURATION);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenuContent]);

    const buttonClasses = buttonIsOpen 
        ? `${BUTTON_BASE_STYLE_CLASSES} rounded-t-[20px] rounded-b-none ${BORDER_CLASS} border-b-0`
        : `${BUTTON_BASE_STYLE_CLASSES} rounded-[20px] ${BORDER_CLASS} ${isHovered ? 'scale-[1.02]' : 'scale-100'}`;

    const handleMouseEnter = () => {
        if (!showMenuContent) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const getMenuItemClasses = (isActive: boolean) => {
        const activeStyle = isActive 
            ? `
              bg-gradient-to-r from-green-900/50 to-green-800/50 
              text-green-400 font-bold 
              rounded-lg
              border border-green-700
            `
            : ''; 

        return `${DROPDOWN_ITEM_BASE_STYLE} ${activeStyle.replace(/\s+/g, ' ').trim()} flex items-center`;
    }

    return (
        <div className={`relative ${CONTAINER_WIDTH_CLASS}`} ref={sortRef}> 
            
            <button
                onClick={handleToggle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={buttonClasses} 
            >
                Sort By
            </button>

            {buttonIsOpen && ( 
                <div
                    className={`
                        absolute top-[calc(100%-1px)] left-0 z-10 
                        w-full ${BG_BLACK} ${MENU_PADDING_CLASS} 
                        rounded-b-[20px] ${BORDER_CLASS} border-t-0 
                        shadow-xl space-y-1 overflow-hidden
                        transition-all duration-[${MENU_TRANSITION_DURATION}ms] ease-in-out
                        ${showMenuContent 
                            ? 'max-h-[300px] opacity-100' 
                            : 'max-h-0 opacity-0'} 
                    `}
                >
                    <div className="space-y-1">
                        <div 
                            className={getMenuItemClasses(difficultySort !== 'none')}
                            onClick={(e) => handleSortClick(e, 'difficulty')}
                        >
                            Difficulty
                            <DifficultyIndicator sort={difficultySort} />
                        </div>
                        <div 
                            className={getMenuItemClasses(statusSort !== 'none')}
                            onClick={(e) => handleSortClick(e, 'status')}
                        >
                            Status
                            <StatusIndicator sort={statusSort} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};