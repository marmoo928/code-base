// learn/page.tsx
'use client'; 

import { useState, useMemo } from 'react';
import { Task, tasks as mockTasks, TaskStatus } from "../lib/placeholder-data"; 
import { TaskListHeader } from "../ui/learn/TaskListHeader"; 
import { TaskListItem } from "../ui/learn/TaskListItem"; 	
import { SortButton } from "../ui/learn/SortByMenu";
import { AppliedSortTags } from "../ui/learn/AppliedSortTags"; 

type SortKey = 'difficulty' | 'status' | 'none';
type SortOrder = 'asc' | 'desc'; 
type StatusSortCycle = 1 | 2 | 3; 

export default function Home() {
    const [sortKey, setSortKey] = useState<SortKey>('none');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc'); 
    const [statusCycle, setStatusCycle] = useState<StatusSortCycle>(1); 

    const sortedTasks = useMemo(() => {
        const sorted = [...mockTasks]; 

        if (sortKey === 'difficulty') {
            sorted.sort((a, b) => {
                const comparison = a.difficulty - b.difficulty;
                return sortOrder === 'asc' ? comparison : -comparison;
            });
        } else if (sortKey === 'status') {
            const getStatusOrder = (cycle: StatusSortCycle): Record<TaskStatus, number> => {
                if (cycle === 1) return { 'In progress': 1, 'Not solved': 2, 'Solved': 3 };
                if (cycle === 2) return { 'Solved': 1, 'Not solved': 2, 'In progress': 3 };
                if (cycle === 3) return { 'Not solved': 1, 'In progress': 2, 'Solved': 3 };
                return { 'In progress': 1, 'Not solved': 2, 'Solved': 3 };
            };
            
            const statusOrder = getStatusOrder(statusCycle);
            sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        }
        
        if (sortKey === 'none') {
            sorted.sort((a, b) => a.index - b.index);
        }

        return sorted;
    }, [sortKey, sortOrder, statusCycle]);

    const handleSortAction = (key: 'difficulty' | 'status') => {
        if (key === sortKey) {
            if (key === 'difficulty') {
                setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
            } else if (key === 'status') {
                setStatusCycle(prevCycle => (prevCycle % 3) + 1 as StatusSortCycle);
            }
        } else {
            setSortKey(key);
            if (key === 'difficulty') {
                setSortOrder('asc');
            } else if (key === 'status') {
                setStatusCycle(1); 
            }
        }
    };
    
    const handleClearSort = () => {
        setSortKey('none');
        setSortOrder('asc');
        setStatusCycle(1);
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-8">
            <div className="flex justify-center mb-8">
                <h1 className="text-white text-5xl font-bold border-3 border-neutral-500 rounded-lg px-10 py-6">
                    Tasks to solve
                </h1>
            </div>
            <div className="mb-8 flex flex-wrap items-center gap-4">
                <SortButton 
                    onSortChange={handleSortAction} 
                    currentSortKey={sortKey}
                    currentSortOrder={sortOrder}
                    statusCycle={statusCycle}
                />
                
                <AppliedSortTags
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    statusCycle={statusCycle}
                    onClearSort={handleClearSort}
                    onToggleOrder={() => handleSortAction(sortKey as 'difficulty' | 'status')} 
                />
            </div>
            
            <TaskListHeader />
            <ul className="space-y-4">
                {sortedTasks.map((task) => (
                    <TaskListItem key={task.index} task={task} />
                ))}
            </ul>
        </div>
    );
}