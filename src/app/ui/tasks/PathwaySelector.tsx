"use client";

import { useEffect, useState } from "react";

interface Pathway {
    id: string;
    name: string;
}

interface PathwaySelectorProps {
    selectedId: string;
    onChange: (id: string) => void;
}

export default function PathwaySelector({ selectedId, onChange }: PathwaySelectorProps) {
    const [pathways, setPathways] = useState<Pathway[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/pathways")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPathways(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-stone-500 text-sm">Loading pathways...</div>;

    return (
        <div>
            <label className="block text-sm font-medium text-stone-400 mb-2">Learning Pathway</label>
            <select
                value={selectedId}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors appearance-none"
            >
                <option value="">No Pathway (Standalone Task)</option>
                {pathways.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
        </div>
    );
}
