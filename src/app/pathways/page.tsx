"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { ConfirmModal } from "@/ui/ConfirmModal";

interface Pathway {
    id: string;
    name: string;
    description: string;
    _count?: { tasks: number };
}

export default function PathwaysPage() {
    const [pathways, setPathways] = useState<Pathway[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [creating, setCreating] = useState(false);
    const [expandedPathwayId, setExpandedPathwayId] = useState<string | null>(null);
    const [allTasks, setAllTasks] = useState<any[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [savingTasks, setSavingTasks] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pathwayToDelete, setPathwayToDelete] = useState<Pathway | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        fetchPathways();
        fetchAllTasks();
    }, []);

    const fetchPathways = async () => {
        const res = await fetch("/api/pathways");
        const data = await res.json();
        if (Array.isArray(data)) setPathways(data);
        setLoading(false);
    };

    const fetchAllTasks = async () => {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (Array.isArray(data)) setAllTasks(data);
    };

    const handleSavePathwayTasks = async (pathwayId: string, taskIds: string[]) => {
        setSavingTasks(true);
        try {
            const res = await fetch(`/api/pathways/${pathwayId}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskIds }),
            });
            if (res.ok) {
                fetchPathways();
                showToast("Pathway tasks updated", "info");
            } else {
                showToast("Failed to update tasks", "error");
            }
        } catch (err) {
            showToast("An error occurred", "error");
        } finally {
            setSavingTasks(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/pathways", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, description: newDesc }),
            });
            if (res.ok) {
                setNewName("");
                setNewDesc("");
                fetchPathways();
                showToast("Pathway created", "info");
            } else {
                showToast("Failed to create pathway", "error");
            }
        } finally {
            setCreating(false);
        }
    };

    const handleDeletePathway = async () => {
        if (!pathwayToDelete) return;
        setShowDeleteConfirm(false);

        try {
            const res = await fetch(`/api/api/pathways?id=${pathwayToDelete.id}`, { method: "DELETE" }); // Wait, check API for delete
            if (res.ok) {
                setPathways(pathways.filter(p => p.id !== pathwayToDelete.id));
                showToast("Pathway deleted", "info");
            } else {
                showToast("Failed to delete pathway", "error");
            }
        } catch (err) {
            showToast("An error occurred", "error");
        } finally {
            setPathwayToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-stone-300 p-8 pt-24">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manage Pathways</h1>
                        <p className="text-stone-400">Organize your tasks into learning journeys</p>
                    </div>
                    <Link href="/learn" className="px-4 py-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors">
                        Back to Dashboard
                    </Link>
                </div>

                {/* Create New Form */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Create New Pathway</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Pathway Name (e.g. Foundations of C)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                            required
                        />
                        <textarea
                            placeholder="Description (Optional)"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                        />
                        <button
                            type="submit"
                            disabled={creating}
                            className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 disabled:opacity-50 transition-colors"
                        >
                            {creating ? "Creating..." : "Create Pathway"}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-stone-500">Loading pathways...</div>
                    ) : pathways.length === 0 ? (
                        <div className="text-center py-10 text-stone-500 bg-stone-900/50 rounded-2xl border border-dashed border-stone-800">
                            No pathways created yet.
                        </div>
                    ) : (
                        pathways.map(p => (
                            <div key={p.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden group hover:border-stone-700 transition-colors">
                                <div className="p-6 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-green-500 transition-colors">{p.name}</h3>
                                        <p className="text-stone-400 mt-1">{p.description || "No description"}</p>
                                        <div className="mt-2 inline-flex items-center gap-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300">
                                            {p._count?.tasks || 0} tasks assigned
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setExpandedPathwayId(expandedPathwayId === p.id ? null : p.id)}
                                            className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl hover:bg-stone-700 hover:text-white transition-all font-bold text-sm"
                                        >
                                            {expandedPathwayId === p.id ? "Close" : "Manage Tasks"}
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setPathwayToDelete(p);
                                                setShowDeleteConfirm(true);
                                            }}
                                            className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete Pathway"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Task Selection */}
                                {expandedPathwayId === p.id && (
                                    <div className="px-6 pb-6 pt-2 border-t border-stone-800 bg-stone-950/50">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                            <div className="w-full md:w-auto flex-1 max-w-md">
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <input 
                                                        type="text"
                                                        placeholder="Search tasks by name..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-600 hidden md:block">Assign Tasks</h4>
                                                <button 
                                                    onClick={() => {
                                                        const selectedIds = allTasks
                                                            .filter(t => t.pathwayId === p.id)
                                                            .map(t => t.id);
                                                        handleSavePathwayTasks(p.id, selectedIds);
                                                    }}
                                                    disabled={savingTasks}
                                                    className="w-full md:w-auto bg-green-600 text-black px-4 py-2 rounded-xl font-black text-xs hover:bg-green-500 disabled:opacity-50 transition-all shadow-lg shadow-green-600/10 active:scale-95"
                                                >
                                                    {savingTasks ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {allTasks
                                                .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map(task => {
                                                const isAssigned = task.pathwayId === p.id;
                                                const isAssignedToOther = task.pathwayId && task.pathwayId !== p.id;
                                                
                                                return (
                                                    <div 
                                                        key={task.id}
                                                        onClick={() => {
                                                            const newTasks = allTasks.map(t => {
                                                                if (t.id === task.id) {
                                                                    return { ...t, pathwayId: isAssigned ? null : p.id };
                                                                }
                                                                return t;
                                                            });
                                                            setAllTasks(newTasks);
                                                        }}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                            isAssigned 
                                                            ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.05)]' 
                                                            : 'bg-stone-900/50 border-stone-800 hover:border-stone-600'
                                                        }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                                            isAssigned 
                                                            ? 'bg-green-500 border-green-500 text-black' 
                                                            : 'border-stone-700'
                                                        }`}>
                                                            {isAssigned && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-bold truncate ${isAssigned ? 'text-green-400' : 'text-stone-300'}`}>
                                                                {task.name}
                                                            </p>
                                                            {isAssignedToOther && (
                                                                <p className="text-[10px] text-amber-500/70 font-medium">In another pathway</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <ConfirmModal 
                    isOpen={showDeleteConfirm}
                    title="Delete Pathway"
                    message={`Are you sure you want to delete "${pathwayToDelete?.name}"? All tasks currently in this pathway will become uncategorized. This action cannot be undone.`}
                    confirmLabel="Delete Pathway"
                    cancelLabel="Cancel"
                    onConfirm={handleDeletePathway}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setPathwayToDelete(null);
                    }}
                    isDestructive={true}
                />
            </div>
        </div>
    );
}
