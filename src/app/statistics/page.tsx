import { fetchTasks, fetchUserProfile } from '../lib/data';
import StatisticsClient from '@/ui/statistics/StatisticsClient';

export default async function StatisticsPage() {
    const [tasks, user] = await Promise.all([
        fetchTasks(),
        fetchUserProfile()
    ]);

    return <StatisticsClient tasks={tasks} userXP={user?.xpTotal || 0} />;
}