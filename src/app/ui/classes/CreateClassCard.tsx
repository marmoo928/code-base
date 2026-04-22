'use client';

import { useState } from 'react';

interface CreateClassCardProps {
    onCreated: () => void;
}

export const CreateClassCard = ({ onCreated }: CreateClassCardProps) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `Class "${name}" created successfully!` });
                setName('');
                setTimeout(() => {
                    onCreated();
                    setMessage(null);
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to create class' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-indigo-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/10 p-4 rounded-2xl">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Create a New Class</h3>
                        <p className="text-neutral-500 text-sm mt-1 max-w-md">
                            Give your class a name to start assigning tasks and monitoring student progress.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="e.g. 1.A - Informatics"
                            className="bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all w-full sm:w-64 font-medium placeholder:text-neutral-700"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50}
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        disabled={loading || !name.trim()}
                        className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating...' : 'Create Class'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mt-4 p-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
