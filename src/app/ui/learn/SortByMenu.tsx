// ui/learn/SortButton.tsx

'use client'; 

import { useState, useRef, useEffect } from 'react';
// Import StatusIndicator (assuming it's in './StatusIndicator' as previously discussed)
// import { StatusIndicator } from './StatusIndicator';

// --- Configuration Constants ---
// FIX: Make container responsive: full width on mobile, fixed width from medium breakpoint up.
const CONTAINER_WIDTH_CLASS = 'w-full md:w-[340px]'; 
const BUTTON_HEIGHT_CLASS = 'h-[71px]';
const BORDER_CLASS = 'border border-neutral-600';
const BG_DARK_GRAY = 'bg-[#5B5B5B]';
const BG_BLACK = 'bg-black';
const INNER_PADDING_CLASS = 'p-3'; 
const MENU_PADDING_CLASS = 'p-3'; 
const BUTTON_TRANSITION_DURATION = 50; 
const MENU_TRANSITION_DURATION = 50; 

// ... (Props interface and Indicators remain the same) ...

interface SortButtonProps {
    onSortChange: (key: 'difficulty' | 'status') => void;
    currentSortKey: string;
    currentSortOrder: 'asc' | 'desc';
    statusCycle: 1 | 2 | 3; 
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

const DifficultyIndicator = ({ isActive, order }: { isActive: boolean, order: 'asc' | 'desc' }) => {
    if (!isActive) return null;
    const arrow = order === 'asc' ? '↑' : '↓'; 
    return (
        <span className={`ml-auto text-yellow-400 font-bold text-lg`}>
            {arrow}
        </span>
    );
}

const StatusIndicator = ({ isActive, cycle }: 
    { isActive: boolean, cycle: 1 | 2 | 3 }) => {
    if (!isActive) return null;
    let indicatorContent: string;
    let colorClass: string = 'text-yellow-400';
    if (cycle === 1) { indicatorContent = '✏️'; colorClass = 'text-blue-400'; } 
    else if (cycle === 2) { indicatorContent = '✅'; colorClass = 'text-green-400'; } 
    else { indicatorContent = '❌'; colorClass = 'text-red-400'; }
    return (
        <span className={`ml-auto ${colorClass} font-bold text-lg`}>
            {indicatorContent}
        </span>
    );
}

export const SortButton = ({ onSortChange, currentSortKey, currentSortOrder, statusCycle }: SortButtonProps) => {
    const [buttonIsOpen, setButtonIsOpen] = useState(false);
    const [showMenuContent, setShowMenuContent] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        if (!showMenuContent) {
            // OPENING: Set button and menu render state immediately
            setButtonIsOpen(true);
            setIsHovered(false);
            setTimeout(() => setShowMenuContent(true), BUTTON_TRANSITION_DURATION);
        } else {
            // CLOSING: Start menu collapse/fade-out instantly.
            setShowMenuContent(false);
            setTimeout(() => setButtonIsOpen(false), MENU_TRANSITION_DURATION);
        }
    };

    const handleSortClick = (key: 'difficulty' | 'status') => {
        onSortChange(key);
        // Execute CLOSING sequence
        setShowMenuContent(false);
        setTimeout(() => setButtonIsOpen(false), MENU_TRANSITION_DURATION);
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

    // Conditional classes for the button based on buttonIsOpen state
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

    const getMenuItemClasses = (key: 'difficulty' | 'status') => {
        const isActive = currentSortKey === key;
        
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
        // FIX: CONTAINER_WIDTH_CLASS is now w-full md:w-[340px]
        <div className={`relative ${CONTAINER_WIDTH_CLASS}`} ref={sortRef}> 
            
            <button
                onClick={handleToggle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={buttonClasses} 
            >
                Sort By
            </button>

            {/* Menu renders when button corners are squared */}
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
                            className={getMenuItemClasses('difficulty')}
                            onClick={() => handleSortClick('difficulty')}
                        >
                            Difficulty
                            <DifficultyIndicator 
                                isActive={currentSortKey === 'difficulty'} 
                                order={currentSortOrder} 
                            />
                        </div>
                        <div 
                            className={getMenuItemClasses('status')}
                            onClick={() => handleSortClick('status')}
                        >
                            Status
                            <StatusIndicator 
                                isActive={currentSortKey === 'status'} 
                                cycle={statusCycle} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};