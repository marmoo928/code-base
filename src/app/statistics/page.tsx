import { fetchTasks, fetchUserProfile, fetchPathways } from '../lib/data';
import StatisticsClient from '@/ui/statistics/StatisticsClient';

export default async function StatisticsPage() {
    const [tasks, user, pathways] = await Promise.all([
        fetchTasks(),
        fetchUserProfile(),
        fetchPathways()
    ]);

    return <StatisticsClient tasks={tasks} userXP={user?.xpTotal || 0} pathways={pathways} />;
}