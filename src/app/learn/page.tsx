import { fetchTasks, fetchPathways } from "@/lib/data";
import PathwayDiscovery from "@/ui/learn/PathwayDiscovery";

export default async function Home() {
    const [tasks, pathways] = await Promise.all([
        fetchTasks(),
        fetchPathways()
    ]);
    
    return <PathwayDiscovery pathways={pathways} allTasks={tasks} />;
}