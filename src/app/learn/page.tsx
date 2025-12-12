// learn/page.tsx
'use client'; 

import { useState, useMemo } from 'react';
import { Task, tasks as mockTasks, TaskStatus } from "../lib/placeholder-data"; 
import { TaskListHeader } from "../ui/learn/TaskListHeader"; 
import { TaskListItem } from "../ui/learn/TaskListItem"; 	
import { SortButton } from "../ui/learn/SortByMenu";
import { AppliedSortTags } from "../ui/learn/AppliedSortTags"; 

// Define possible sort states
type SortKey = 'difficulty' | 'status' | 'none';
type SortOrder = 'asc' | 'desc'; 
type StatusSortCycle = 1 | 2 | 3; // 1: In Progress first, 2: Solved first, 3: Not Solved first

export default function Home() {
    const [sortKey, setSortKey] = useState<SortKey>('none');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc'); 
    const [statusCycle, setStatusCycle] = useState<StatusSortCycle>(1); 

    // 2. SORTING LOGIC (omitted for brevity)
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

    // 3. CONSOLIDATED ACTION: Handles selection AND cycling/toggling on repeat clicks.
    const handleSortAction = (key: 'difficulty' | 'status') => {
        if (key === sortKey) {
            // Case 1: Key is already active -> CYCLE/TOGGLE
            if (key === 'difficulty') {
                setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
            } else if (key === 'status') {
                setStatusCycle(prevCycle => (prevCycle % 3) + 1 as StatusSortCycle);
            }
        } else {
            // Case 2: New key selected -> SET NEW KEY and reset order/cycle
            setSortKey(key);
            if (key === 'difficulty') {
                setSortOrder('asc'); // Default to ascending on new selection
            } else if (key === 'status') {
                setStatusCycle(1); // Default to cycle 1 on new selection
            }
        }
    };
    
    // 4. Clear Sort Function
    const handleClearSort = () => {
        setSortKey('none');
        setSortOrder('asc');
        setStatusCycle(1);
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-8">
            {/* ... Page Title Header (omitted) ... */}
            
            {/* FIX: Add flex-wrap here to ensure the SortButton and Tags stack on narrow screens */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
                <SortButton 
                    onSortChange={handleSortAction} // MENU OPTIONS call this action
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
            
            {/* ... Task List Header and Items (omitted) ... */}
            <TaskListHeader />
            <ul className="space-y-4">
                {sortedTasks.map((task) => (
                    <TaskListItem key={task.index} task={task} />
                ))}
            </ul>
        </div>
    );
}