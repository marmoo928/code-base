import React from 'react';

// Define the properties the modal will accept
interface SolutionSuccessModalProps {
    score: number; // e.g., 100
    xpGained: number; // e.g., 15
    nextTaskName: string; // e.g., "Labyrint Algoritmov"
    nextTaskCategory: string; // e.g., "Recursion"
    onClose: () => void;
    onGoToStats: () => void;
    onGoToNextTask: () => void;
}

/**
 * Renders the submission success modal (pop-up) with score and rewards.
 * The modal is centered on the screen.
 */
const SolutionSuccessModal: React.FC<SolutionSuccessModalProps> = ({
    score,
    xpGained,
    nextTaskName,
    nextTaskCategory,
    onClose,
    onGoToStats,
    onGoToNextTask,
}) => {
    return (
        // Overlay container: Fills screen, dark background, centers the modal
        // Note: Using a translucent background for better visual separation
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            
            {/* Modal Container: Matches Figma dimensions and styling */}
            <div className="w-[489px] h-[565px] relative bg-neutral-900 rounded-2xl border border-neutral-700 shadow-2xl p-6 flex flex-col items-center">
                
                {/* 1. Back Button (Top Left) */}
                <button 
                    onClick={onClose}
                    className="h-11 px-6 absolute top-4 left-4 bg-green-500 rounded-xl border-2 border-black text-black text-lg font-semibold hover:bg-green-400 transition-colors flex items-center justify-center"
                >
                    &lt; Back
                </button>
                
                {/* 2. Main Content Area (Centrally Aligned) */}
                <div className="flex flex-col items-center pt-20">
                    
                    {/* Title */}
                    <h2 className="text-white text-4xl font-semibold mb-10">
                        Congratulations!
                    </h2>

                    {/* XP Gained */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="text-stone-300 text-xl font-medium mb-1">You get:</div>
                        <div className="text-white text-5xl font-normal">
                            {xpGained} XP
                        </div>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="text-stone-300 text-xl font-medium mb-1">Your score:</div>
                        <div className="text-white text-5xl font-normal">
                            {score} %
                        </div>
                    </div>
                </div>

                {/* 3. Next Task Recommendation (Bottom Right Aligned) */}
                <div className="absolute right-6 bottom-28 text-right">
                    <div className="text-stone-300 text-base mb-1">
                        We recommend you solve this next:
                    </div>
                    {/* Using a small bold category name for structure */}
                    <div className="text-stone-300 text-sm">
                        <span className="font-semibold">{nextTaskName}</span> &rarr; {nextTaskCategory}
                    </div>
                </div>

                {/* 4. Action Buttons (Bottom) */}
                <div className="absolute bottom-6 flex justify-center gap-4 w-full px-6">
                    {/* My Statistics Button */}
                    <button 
                        onClick={onGoToStats}
                        className="flex-1 h-11 bg-green-500 rounded-xl border-2 border-black text-black text-lg font-semibold hover:bg-green-400 transition-colors"
                    >
                        My Statistics
                    </button>
                    
                    {/* Next Task Button */}
                    <button 
                        onClick={onGoToNextTask}
                        className="flex-1 h-11 bg-green-500 rounded-xl border-2 border-black text-black text-lg font-semibold hover:bg-green-400 transition-colors"
                    >
                        Next Task
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SolutionSuccessModal;