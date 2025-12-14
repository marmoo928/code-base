// /app/ui/statistics/SolutionsTab.tsx

import { Task } from '../../lib/placeholder-data';
import { TaskListHeader } from '../learn/TaskListHeader';
import { TaskListItem } from '../learn/TaskListItem';

interface SolutionsTabProps {
    solvedTasksList: Task[];
}

export const SolutionsTab = ({ solvedTasksList }: SolutionsTabProps) => {
    return (
        <div className="max-w-[980px] mx-auto">
            
            <TaskListHeader />
            {solvedTasksList.length > 0 ? (
                <div className="space-y-0">
                    {solvedTasksList.map(task => (
                        <TaskListItem 
                            key={task.index}
                            task={task}
                            buttonText="View"
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl py-12 text-center">
                    <p className="text-neutral-500 text-lg">No solutions yet. Start solving tasks!</p>
                </div>
            )}
        </div>
    );
};