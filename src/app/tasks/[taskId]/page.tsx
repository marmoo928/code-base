// /src/app/tasks/[taskId]/page.tsx
import TaskPage from "@/ui/tasks/TaskPage";

interface TaskPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default async function DynamicTaskRoutePage({ params }: TaskPageProps) {
  const { taskId } = await params;

  if (!taskId) {
    return (
      <div className="text-white text-center mt-20">
        Error: Task ID missing from URL.
      </div>
    );
  }

  return <TaskPage taskId={taskId} />;
}