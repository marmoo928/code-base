"use client"; 
// ^ IMPORTANT: Added directive to make this a Client Component

import { Task } from "../../lib/placeholder-data"; 
import { DifficultyStars } from "./DifficultyStars"; 
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; // <-- NEW: Import useRouter

interface TaskListItemProps {
	task: Task;
	buttonText?: string; // Optional prop to customize button text
}

export const TaskListItem = ({ task, buttonText = "Solve" }: TaskListItemProps) => {
    const router = useRouter(); // <-- NEW: Initialize router
    const taskPath = `/tasks/${task.index}`;
    
    // <-- NEW: Define click handler for the Solve button
    const handleSolveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // 1. Prevents the click from activating the outer Link/Card
        router.push(taskPath); // 2. Imperatively navigates to the task page
    };

		return (
			<Link 
				href={taskPath} 
				passHref 
				className="block bg-neutral-900 rounded-2xl border border-neutral-700 flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 py-2.5 px-4 sm:px-8 w-full min-h-[100px] md:min-h-[120px] shadow-xl transition-all duration-200 cursor-pointer hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] active:scale-[0.99] active:border-green-400 overflow-hidden mb-4" 
			>
			<div className="w-full">
				
				{/* --- Desktop Layout - Hidden on mobile --- */}
				<div className="hidden md:grid w-full items-center gap-6" 
					style={{ gridTemplateColumns: '40px 240px 1fr 140px 140px 80px 120px' }}>
					
					{/* ID */}
					<div className="text-stone-300 text-2xl font-medium">
						{task.index}.
					</div>
					
					{/* Name */}
					<div className="text-stone-300 text-2xl font-medium truncate">
						{task.name}
					</div>
					
					<div className="w-44 h-24 max-w-64 max-h-28 px-1 py-5 inline-flex justify-center gap-2.5 flex-wrap content-center overflow-hidden">
						{task.tags.map((tag) => (
							<span
								key={tag}
								className="h-8 p-2 bg-neutral-900 rounded-lg border border-neutral-500 flex justify-center items-center text-neutral-200 text-base font-normal leading-4"
							>
								{tag}
							</span>
						))}
					</div>
					
					{/* Status */}
					<div className="text-stone-300 text-xl text-center">
						{task.status}
					</div>
					
					{/* Difficulty */}
					<div className="flex justify-center">
						<DifficultyStars difficulty={task.difficulty} />
					</div>
					
					{/* XP */}
					<div className="text-stone-300 text-2xl text-center">
						{task.xp}
					</div>
					
					<button onClick={handleSolveClick} className="bg-green-500 text-black rounded-xl border-2 border-black text-lg font-semibold hover:bg-green-400 active:bg-green-600 active:scale-[0.97] transition-all duration-100 py-2.5 px-6">
						{buttonText}
					</button>
				</div>

				{/* --- Mobile Layout - Hidden on desktop --- */}
				<div className="flex md:hidden flex-col w-full gap-4">
					{/* Top Row: Name + Stats */}
					<div className="flex justify-between items-start gap-3">
						{/* Name */}
						<div className="text-stone-300 text-xl font-medium flex-1 min-w-0">
							{task.name}
						</div>
						
						{/* Stats in upper right */}
						<div className="flex flex-col items-end gap-1 shrink-0">
							{/* Difficulty */}
							<div className="flex items-center scale-75 origin-right">
								<DifficultyStars difficulty={task.difficulty} />
							</div>
							
							{/* XP */}
							<div className="text-stone-300 text-sm font-medium">
								{task.xp} XP
							</div>
							
							{/* Status */}
							<div className="text-stone-400 text-xs">
								{task.status}
							</div>
						</div>
					</div>
					
					{/* Categories */}
					<div className="flex flex-wrap gap-2">
						{task.tags.map((tag) => (
							<span
								key={tag}
								className="rounded-lg bg-neutral-800 border border-neutral-600 text-neutral-200 text-sm py-1 px-3"
							>
								{tag}
							</span>
						))}
					</div>
					
					<button onClick={handleSolveClick} className="bg-green-500 text-black rounded-xl border-2 border-black text-lg font-semibold hover:bg-green-400 active:bg-green-600 active:scale-[0.97] transition-all duration-100 py-2.5 px-6 w-full">
						{buttonText}
					</button>
				</div>
			</div>
		</Link>
	);
};