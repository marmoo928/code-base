import { TaskListHeader } from '@/ui/TaskListHeader';
import { TaskListItem } from '@/ui/TaskListItem';

interface SolutionsTabProps {
    solvedTasksList: any[];
}

export const SolutionsTab = ({ solvedTasksList }: SolutionsTabProps) => {
    return (
        <div className="w-full">

            <TaskListHeader />
            {solvedTasksList.length > 0 ? (
                <div className="space-y-0">
                    {solvedTasksList.map((task, index) => (
                        <TaskListItem
                            key={task.id}
                            task={{ ...task, displayIndex: index + 1 }}
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