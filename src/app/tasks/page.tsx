"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DifficultyStars } from "@/ui/learn/DifficultyStars";

import { useToast } from "@/context/ToastContext";
import { ConfirmModal } from "@/ui/ConfirmModal";

interface Task {
    id: string;
    index: number;
    name: string;
    difficulty: number;
    xp: number;
}

export default function ManageTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { showToast } = useToast();
    const router = useRouter();

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks");
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            } else {
                setError("Failed to fetch tasks");
            }
        } catch (err) {
            setError("An error occurred while fetching tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async () => {
        if (!taskToDelete) return;
        setShowDeleteConfirm(false);

        try {
            const res = await fetch(`/api/tasks?id=${taskToDelete.id}`, { method: "DELETE" });
            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== taskToDelete.id));
                showToast(`Task "${taskToDelete.name}" deleted`, "info");
            } else {
                showToast("Failed to delete task", "error");
            }
        } catch (err) {
            showToast("An error occurred while deleting the task", "error");
        } finally {
            setTaskToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Manage Tasks</h1>
                        <p className="text-stone-400">Create, edit, or remove programming challenges.</p>
                    </div>
                    <Link 
                        href="/tasks/new"
                        className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Task
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-sm font-bold mb-8">
                        {error}
                    </div>
                )}

                <div className="mb-8 max-w-md">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text"
                            placeholder="Search tasks by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-stone-500 font-bold">
                        Loading tasks...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-[32px] p-20 text-center">
                        <p className="text-stone-500 font-medium mb-4">No tasks found.</p>
                        <Link href="/tasks/new" className="text-green-500 font-bold hover:underline">
                            Create your first task
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tasks
                            .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((task) => (
                            <Link 
                                key={task.id}
                                href={`/tasks/${task.id}/edit`}
                                className="bg-neutral-900 rounded-[28px] border border-neutral-800 flex flex-col md:flex-row items-center gap-6 py-6 px-8 w-full transition-all duration-200 cursor-pointer hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-[0.99] group overflow-hidden"
                            >
                                {/* ID - matching TaskListItem style */}
                                <div className="text-stone-500 text-2xl font-medium w-10">
                                    {task.index}.
                                </div>

                                {/* Name & Metadata - matching TaskListItem style */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-stone-300 text-2xl font-semibold mb-1 group-hover:text-white transition-colors">
                                        {task.name}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center scale-75 origin-left">
                                            <DifficultyStars difficulty={task.difficulty} />
                                        </div>
                                    </div>
                                </div>

                                {/* XP - matching TaskListItem style */}
                                <div className="text-stone-300 text-2xl font-black text-center w-24">
                                    {task.xp}
                                    <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1 opacity-50">XP</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
                                    <div 
                                        className="bg-neutral-800 group-hover:bg-green-600 group-hover:text-black text-white px-6 py-3 rounded-2xl text-sm font-black transition-all border border-neutral-700 group-hover:border-transparent"
                                    >
                                        Edit
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setTaskToDelete(task);
                                            setShowDeleteConfirm(true);
                                        }}
                                        className="text-red-500/60 hover:text-red-500 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:bg-red-500/10"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                
                <ConfirmModal 
                    isOpen={showDeleteConfirm}
                    title="Delete Task"
                    message={`Are you sure you want to delete task "${taskToDelete?.name}"? This will also remove it from all assigned classes. This action cannot be undone.`}
                    confirmLabel="Delete Task"
                    cancelLabel="Cancel"
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setTaskToDelete(null);
                    }}
                    isDestructive={true}
                />
            </div>
        </div>
    );
}
