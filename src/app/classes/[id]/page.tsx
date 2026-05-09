import { fetchClassWithTasks } from "@/lib/data";
import { notFound } from "next/navigation";
import { TaskListHeader } from "@/ui/TaskListHeader";
import { TaskListItem } from "@/ui/TaskListItem";
import LeaveClassButton from "@/ui/classes/LeaveClassButton";
import ClassStudentList from "@/ui/classes/ClassStudentList";
import { getSession } from "@/lib/auth";

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    const classData = await fetchClassWithTasks(id);

    if (!classData) {
        notFound();
    }

    const isTeacher = session?.user?.role === 'TEACHER';

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-[1400px] mx-auto">
                {isTeacher ? (
                    <ClassStudentList 
                        classId={classData.id} 
                        className={classData.name} 
                        joinCode={classData.joinCode || ""} 
                    />
                ) : (
                    <>
                        <div className="mb-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h1 className="text-4xl font-black tracking-tight">{classData.name}</h1>
                                </div>
                                <LeaveClassButton classId={classData.id} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                Assigned Tasks
                                <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded-full">{classData.tasks.length}</span>
                            </h2>
                            
                            <TaskListHeader />
                            <ul className="space-y-4">
                                {classData.tasks.length > 0 ? (
                                    classData.tasks.map((task, index) => (
                                        <TaskListItem 
                                            key={task.id} 
                                            task={{ ...task, displayIndex: index + 1 }} 
                                        />
                                    ))
                                ) : (
                                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 text-center">
                                        <p className="text-stone-500 font-medium">No tasks assigned to this class yet.</p>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
