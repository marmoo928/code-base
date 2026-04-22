'use client';

import { useRouter } from 'next/navigation';
import { CreateClassCard } from './CreateClassCard';

export default function CreateClassWrapper() {
    const router = useRouter();

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <CreateClassCard 
            onCreated={handleRefresh} 
        />
    );
}
