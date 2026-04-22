import React from 'react';

interface SolutionSuccessModalProps {
    score: number;
    xpGained: number; 
    nextTaskName: string; 
    nextTaskCategory: string; 
    onClose: () => void;
    onGoBack: () => void;
    onGoToStats: () => void;
    onGoToNextTask: () => void;
}

const SolutionSuccessModal: React.FC<SolutionSuccessModalProps> = ({
    score,
    xpGained,
    nextTaskName,
    nextTaskCategory,
    onClose,
    onGoBack,
    onGoToStats,
    onGoToNextTask,
}) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            <div 
                className="w-[489px] h-[565px] relative bg-neutral-900 rounded-2xl border border-neutral-700 shadow-2xl p-6 flex flex-col items-center z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onGoBack}
                    className="h-11 px-6 absolute top-4 left-4 bg-green-500 rounded-xl border-2 border-black text-black text-lg font-semibold hover:bg-green-400 transition-colors flex items-center justify-center"
                >
                    &lt; Back
                </button>
                
                <div className="flex flex-col items-center pt-20">
                    
                    <h2 className="text-white text-4xl font-semibold mb-10 text-center">
                        {score === 100 ? "Congratulations!" : "Good effort!"}
                    </h2>

                    <div className="flex flex-col items-center mb-8">
                        <div className="text-stone-300 text-xl font-medium mb-1">You get:</div>
                        <div className="text-white text-5xl font-normal">
                            {xpGained} XP
                        </div>
                    </div>

                    <div className="flex flex-col items-center mb-10">
                        <div className="text-stone-300 text-xl font-medium mb-1">Your score:</div>
                        <div className="text-white text-5xl font-normal">
                            {score} %
                        </div>
                    </div>
                </div>

                <div className="absolute right-6 bottom-28 text-right">
                    <div className="text-stone-300 text-base mb-1">
                        We recommend you solve this next:
                    </div>
                    <div className="text-stone-300 text-sm">
                        <span className="font-semibold">{nextTaskName}</span> &rarr; {nextTaskCategory}
                    </div>
                </div>

                <div className="absolute bottom-6 flex justify-center gap-4 w-full px-6">
                    <button 
                        onClick={onGoToStats}
                        className="flex-1 h-11 bg-green-500 rounded-xl border-2 border-black text-black text-lg font-semibold hover:bg-green-400 transition-colors"
                    >
                        My Statistics
                    </button>
                    
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