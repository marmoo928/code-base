"use client";

import { DifficultyStars } from "@/ui/learn/DifficultyStars";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TaskListItemProps {
	task: any;
	buttonText?: string; 
	onTagClick?: (tag: string) => void;
}

export const TaskListItem = ({ task, buttonText = "Solve", onTagClick }: TaskListItemProps) => {
	const router = useRouter();
	const taskPath = `/tasks/${task.index}`;
	const displayButtonText = 
		task.status === 'Solved' ? 'View' : 
		task.status === 'Submitted' ? 'Continue' : 
		buttonText;
	const isSolved = task.status === 'Solved';

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
				<div className="hidden md:grid w-full items-center gap-6 py-2"
					style={{ gridTemplateColumns: '40px 2.5fr 1fr 120px 120px 80px 120px' }}>

					{/* ID */}
					<div className="text-stone-300 text-2xl font-medium">
						{task.displayIndex ? `${task.displayIndex}.` : '#'}
					</div>

					{/* Name & Required Badge */}
					<div className="flex flex-col min-w-0 pr-4">
						<div className="text-stone-300 text-2xl font-semibold mb-1">
							{task.name}
						</div>
						<div className="flex items-center gap-3">
							{task.isRequired && (
								<span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border ${isSolved ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{isSolved ? (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										) : (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
										)}
									</svg>
									Required
								</span>
							)}
							{task.deadline && (
								<div className={`text-[11px] font-black uppercase tracking-tight flex items-center gap-1 ${isSolved ? 'text-green-500/60' : 'text-red-500/60'}`}>
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{isSolved ? (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										) : (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										)}
									</svg>
									{isSolved ? 'Done' : `Due: ${new Date(task.deadline).toLocaleDateString()}`}
								</div>
							)}
						</div>
					</div>

					{/* Tags Box */}
					<div className="flex flex-wrap gap-2 justify-center items-center overflow-hidden max-h-[80px]">
						{task.tags.map((tag: string) => (
							<button
								key={tag}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onTagClick?.(tag);
								}}
								className="px-2.5 py-1 bg-neutral-800 rounded-lg border border-neutral-600 flex items-center text-neutral-200 text-xs font-bold uppercase tracking-wide whitespace-nowrap hover:bg-neutral-700 hover:border-neutral-400 transition-colors"
							>
								{tag}
							</button>
						))}
					</div>

					{/* Status */}
					<div className="text-stone-400 text-sm text-center font-medium leading-tight">
						{task.status}
					</div>

					{/* Difficulty */}
					<div className="flex justify-center">
						<DifficultyStars difficulty={task.difficulty} />
					</div>

					{/* XP */}
					<div className="text-stone-300 text-2xl font-black text-center flex flex-col items-center">
						<span className="leading-none">
							{(task.earnedXP !== undefined && task.earnedXP > 0) || task.status === 'Solved' 
								? task.earnedXP 
								: task.xp}
						</span>
						{task.earnedXP !== undefined && task.earnedXP > 0 && task.earnedXP !== task.xp && (
							<span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1 opacity-50">
								/ {task.xp} MAX
							</span>
						)}
						{((task.earnedXP === undefined || task.earnedXP === 0) && task.status !== 'Solved') && (
							<span className="block text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1 opacity-50">XP</span>
						)}
					</div>

					<div className="flex justify-end">
						<button onClick={handleSolveClick} className="bg-green-500 text-black rounded-xl border border-black/10 text-base font-black hover:bg-green-400 active:bg-green-600 active:scale-[0.95] transition-all duration-100 py-2.5 px-6 whitespace-nowrap shadow-md shadow-green-500/10">
							{displayButtonText}
						</button>
					</div>
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
								{(task.earnedXP !== undefined && task.earnedXP > 0) || task.status === 'Solved' 
									? `${task.earnedXP} / ${task.xp} XP` 
									: `${task.xp} XP`}
							</div>

							{/* Status */}
							<div className="text-stone-400 text-xs">
								{task.status}
							</div>
						</div>
					</div>

					{/* Categories */}
					<div className="flex flex-wrap gap-2">
						{task.tags.map((tag: string) => (
							<button
								key={tag}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onTagClick?.(tag);
								}}
								className="rounded-lg bg-neutral-800 border border-neutral-600 text-neutral-200 text-sm py-1 px-3 hover:bg-neutral-700 transition-colors"
							>
								{tag}
							</button>
						))}
					</div>

					<button onClick={handleSolveClick} className="bg-green-500 text-black rounded-xl border-2 border-black text-lg font-semibold hover:bg-green-400 active:bg-green-600 active:scale-[0.97] transition-all duration-100 py-2.5 px-6 w-full">
						{displayButtonText}
					</button>
				</div>
			</div>
		</Link>
	);
};