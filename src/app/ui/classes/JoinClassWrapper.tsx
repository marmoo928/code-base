'use client';

import { useRouter } from 'next/navigation';
import { JoinClassCard } from '../learn/JoinClassCard';

export default function JoinClassWrapper() {
    const router = useRouter();

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <JoinClassCard 
            onJoined={handleRefresh} 
        />
    );
}
