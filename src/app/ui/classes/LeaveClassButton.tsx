'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { ConfirmModal } from '../ConfirmModal';

interface LeaveClassButtonProps {
    classId: string;
    className?: string;
}

export default function LeaveClassButton({ classId, className = "" }: LeaveClassButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const { showToast } = useToast();

    const handleLeave = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            const res = await fetch('/api/classes/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId })
            });

            if (res.ok) {
                showToast("You have left the class", "info");
                router.push('/classes');
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to leave class.', "error");
            }
        } catch (err) {
            console.error("Failed to leave class", err);
            showToast('Something went wrong.', "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-bold text-sm ${className}`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {loading ? 'Leaving...' : 'Leave Class'}
            </button>

            <ConfirmModal 
                isOpen={showConfirm}
                title="Leave Class"
                message="Are you sure you want to leave this class? This will remove all assigned tasks for this class from your view."
                confirmLabel="Leave Class"
                cancelLabel="Stay in Class"
                onConfirm={handleLeave}
                onCancel={() => setShowConfirm(false)}
                isDestructive={true}
            />
        </>
    );
}
