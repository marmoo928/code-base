import { fetchUserClasses } from "@/lib/data";
import Link from "next/link";
import JoinClassWrapper from "@/ui/classes/JoinClassWrapper";
import CreateClassWrapper from "@/ui/classes/CreateClassWrapper";
import { getSession } from "@/lib/auth";

export default async function ClassesOverviewPage() {
    const session = await getSession();
    const isTeacher = session?.user?.role === 'TEACHER';
    const classes = await fetchUserClasses();

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tight mb-4 text-white">
                        {isTeacher ? "Manage Classes" : "My Classes"}
                    </h1>
                    <p className="text-stone-400 text-lg">
                        {isTeacher 
                            ? "Manage your student groups, assign tasks, and monitor learning progress." 
                            : "Select a class to view your assigned programming tasks."}
                    </p>
                </div>

                <div className="mb-12">
                    {isTeacher ? <CreateClassWrapper /> : <JoinClassWrapper />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.length > 0 ? (
                        classes.map((c) => (
                            <Link 
                                key={c.id} 
                                href={`/classes/${c.id}`}
                                className="group bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-indigo-400 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18.3c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="bg-stone-800 text-stone-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
                                            {c.studentCount} Students
                                        </div>
                                        {isTeacher && typeof c.joinCode === 'string' && (
                                            <div className="text-[10px] text-indigo-400 font-mono font-bold tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                                {c.joinCode}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{c.name}</h3>
                                <div className="text-stone-500 text-xs font-bold uppercase tracking-wider">
                                    {c.taskCount} Assigned Tasks
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 text-center">
                            <p className="text-stone-500 font-medium mb-4">
                                {isTeacher ? "You haven't created any classes yet." : "You haven't joined any classes yet."}
                            </p>
                            <div className="flex justify-center">
                                {isTeacher ? (
                                    <span className="text-indigo-400 font-bold">Use the form above to get started!</span>
                                ) : (
                                    <Link href="/learn" className="text-indigo-500 hover:underline font-bold">
                                        Discover tasks to get started
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
