"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PathwaySelector from "@/ui/tasks/PathwaySelector";

export default function NewTaskPage() {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState(3);
    const [xp, setXp] = useState(25);
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [outputDescription, setOutputDescription] = useState("");
    const [exampleInput, setExampleInput] = useState("");
    const [exampleOutput, setExampleOutput] = useState("");
    const [constraints, setConstraints] = useState("");
    const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "", isHidden: false }]);
    const [pathwayId, setPathwayId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const addTestCase = () => {
        setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false }]);
    };

    const removeTestCase = (index: number) => {
        if (testCases.length === 1) return;
        setTestCases(testCases.filter((_, i) => i !== index));
    };

    const updateTestCase = (index: number, field: string, value: any) => {
        const newTestCases = [...testCases];
        (newTestCases[index] as any)[field] = value;
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const tagList = tags.split(",").map(t => t.trim()).filter(t => t !== "");

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    difficulty,
                    xp,
                    tags: tagList,
                    description,
                    inputDescription,
                    outputDescription,
                    exampleInput,
                    exampleOutput,
                    constraints,
                    testCases,
                    pathwayId
                }),
            });

            const data = await res.json();
            if (data.success) {
                router.push(`/learn`);
                router.refresh();
            } else {
                setError(data.error || "Failed to create task");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-stone-300 p-8">
            <div className="max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create New Task</h1>
                        <p className="text-stone-400">Define a new programming challenge for your students</p>
                    </div>
                    <Link href="/learn" className="text-stone-400 hover:text-white transition-colors">
                        Cancel
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-400 mb-2">Task Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="Fibonacci Sequence"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-400 mb-2">Difficulty (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={difficulty}
                                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-400 mb-2">XP Reward</label>
                            <input
                                type="number"
                                value={xp}
                                onChange={(e) => setXp(parseInt(e.target.value))}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-400 mb-2">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="Recursion, Dynamic Programming"
                            />
                        </div>
                        <PathwaySelector 
                            selectedId={pathwayId} 
                            onChange={setPathwayId} 
                        />
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-400 mb-2">Description (Full task explanation)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white h-32 focus:outline-none focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-400 mb-2">Input Description</label>
                                <textarea
                                    value={inputDescription}
                                    onChange={(e) => setInputDescription(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white h-24 focus:outline-none focus:border-green-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-400 mb-2">Output Description</label>
                                <textarea
                                    value={outputDescription}
                                    onChange={(e) => setOutputDescription(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white h-24 focus:outline-none focus:border-green-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Examples */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-400 mb-2">Example Input</label>
                            <textarea
                                value={exampleInput}
                                onChange={(e) => setExampleInput(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white font-mono h-24 focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-400 mb-2">Example Output</label>
                            <textarea
                                value={exampleOutput}
                                onChange={(e) => setExampleOutput(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white font-mono h-24 focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-400 mb-2">Constraints</label>
                        <input
                            type="text"
                            value={constraints}
                            onChange={(e) => setConstraints(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="0 ≤ N ≤ 40"
                        />
                    </div>

                    {/* Test Cases */}
                    <div className="border-t border-stone-800 pt-8 mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">System Test Cases</h2>
                            <button
                                type="button"
                                onClick={addTestCase}
                                className="text-green-500 hover:text-green-400 font-medium flex items-center gap-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Case
                            </button>
                        </div>

                        <div className="space-y-4">
                            {testCases.map((tc, idx) => (
                                <div key={idx} className="bg-stone-950 border border-stone-800 rounded-2xl p-6 relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wider">Input</label>
                                            <textarea
                                                value={tc.input}
                                                onChange={(e) => updateTestCase(idx, "input", e.target.value)}
                                                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-white font-mono h-20 focus:outline-none focus:border-green-500 transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wider">Expected Output</label>
                                            <textarea
                                                value={tc.expectedOutput}
                                                onChange={(e) => updateTestCase(idx, "expectedOutput", e.target.value)}
                                                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-white font-mono h-20 focus:outline-none focus:border-green-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm text-stone-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={tc.isHidden}
                                                onChange={(e) => updateTestCase(idx, "isHidden", e.target.checked)}
                                                className="w-4 h-4 bg-stone-900 border-stone-800 rounded accent-green-500"
                                            />
                                            Hidden test case
                                        </label>
                                        {testCases.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTestCase(idx)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-black font-bold py-4 rounded-xl transition-all duration-200 active:scale-[0.98] mt-8"
                    >
                        {loading ? "Creating Task..." : "Create Task"}
                    </button>
                </form>
            </div>
        </div>
    );
}
