'use client';

import { useState } from 'react';

interface JoinClassCardProps {
    onJoined: () => void;
}

export const JoinClassCard = ({ onJoined }: JoinClassCardProps) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleJoin = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/classes/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ joinCode: code })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setCode('');
                setTimeout(() => {
                    onJoined();
                    setMessage(null);
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-blue-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-500/10 p-4 rounded-2xl">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4a1 1 0 011-1h2a1 1 0 011 1v3M12 21V10" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Join a Class</h3>
                        <p className="text-neutral-500 text-sm mt-1 max-w-md">
                            Enter the code provided by your teacher to join their class and track your specific progress.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="CODE123"
                            className="bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all w-full sm:w-40 font-mono tracking-widest uppercase placeholder:font-sans placeholder:tracking-normal placeholder:text-neutral-700"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            maxLength={6}
                        />
                    </div>
                    <button 
                        onClick={handleJoin}
                        disabled={loading || !code.trim()}
                        className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Joining...' : 'Join Class'}
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
