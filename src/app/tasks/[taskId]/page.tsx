import TaskPage from "@/ui/tasks/TaskPage";
import { fetchTaskByIndex } from "@/lib/data";
import { notFound } from "next/navigation";

interface TaskPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default async function DynamicTaskRoutePage({ params }: TaskPageProps) {
  const { taskId } = await params;
  const index = parseInt(taskId, 10);

  if (!taskId || isNaN(index)) {
    return (
      <div className="text-white text-center mt-20">
        Error: Invalid Task ID in URL. expected a number, got "{taskId}".
      </div>
    );
  }

  const task = await fetchTaskByIndex(index);

  if (!task) {
    notFound();
  }

  return <TaskPage task={task} />;
}