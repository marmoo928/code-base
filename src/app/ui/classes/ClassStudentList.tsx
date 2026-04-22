'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { ConfirmModal } from '../ConfirmModal';

interface Student {
    id: string;
    name: string;
    email: string;
    xp: number;
    solvedCount?: number;
    taskStatus?: string;
    submittedAt?: string;
    onTime?: boolean | null;
    totalTasks: number;
    joinedAt: string;
}

interface ClassStudentListProps {
    classId: string;
    joinCode: string;
    className: string;
}

interface SubmissionData {
    studentName: string;
    taskName: string;
    taskXP: number;
    status: string;
    code: string;
    language: string;
    submittedAt: string;
    xpEarned: number;
    results: { 
        passed: boolean; 
        isHidden: boolean;
        input?: string;
        expectedOutput?: string;
        actualOutput?: string;
    }[];
}

export default function ClassStudentList({ classId, joinCode, className }: ClassStudentListProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [allTasks, setAllTasks] = useState<any[]>([]);
    const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskSearch, setTaskSearch] = useState("");

    // Analytics state
    const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

    // Submission viewer state
    const [submission, setSubmission] = useState<SubmissionData | null>(null);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [submissionStudent, setSubmissionStudent] = useState<Student | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const studentsUrl = activeAssignmentId
                ? `/api/students?classId=${classId}&taskId=${activeAssignmentId}`
                : `/api/students?classId=${classId}`;

            const [studentsRes, tasksRes, assignmentsRes] = await Promise.all([
                fetch(studentsUrl),
                fetch("/api/tasks"),
                fetch(`/api/classes?id=${classId}`)
            ]);

            const studentsData = await studentsRes.json();
            const tasksData = await tasksRes.json();
            const assignmentsData = await assignmentsRes.json();

            setStudents(Array.isArray(studentsData) ? studentsData : []);
            setAllTasks(Array.isArray(tasksData) ? tasksData : []);
            setAssignedTasks(assignmentsData.assignedTasks || []);
        } catch (err) {
            setError("Failed to fetch class data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [classId, activeAssignmentId]);

    const handleViewSolution = async (student: Student) => {
        if (!activeAssignmentId) return;
        setSubmissionStudent(student);
        setSubmissionLoading(true);
        setSubmission(null);
        try {
            const res = await fetch(`/api/submissions?studentId=${student.id}&taskId=${activeAssignmentId}`);
            if (res.ok) {
                const data = await res.json();
                setSubmission(data);
            } else {
                setSubmission(null);
            }
        } catch {
            setSubmission(null);
        } finally {
            setSubmissionLoading(false);
        }
    };

    const { showToast } = useToast();

    const handleAssignTask = async () => {
        if (!selectedTaskId) return;
        try {
            const res = await fetch("/api/classes/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId, taskId: selectedTaskId, dueDate: taskDueDate })
            });
            if (res.ok) {
                showToast("Task assigned successfully!", "success");
                setShowAssignModal(false);
                setSelectedTaskId("");
                setTaskDueDate("");
                fetchData();
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to assign task", "error");
            }
        } catch {
            showToast("Something went wrong", "error");
        }
    };

    const handleUnassignTask = async (taskId: string) => {
        try {
            const res = await fetch(`/api/classes/assign?classId=${classId}&taskId=${taskId}`, { method: "DELETE" });
            if (res.ok) {
                showToast("Task unassigned", "info");
                if (activeAssignmentId === taskId) setActiveAssignmentId(null);
                fetchData();
            } else {
                showToast("Failed to unassign task", "error");
            }
        } catch {
            showToast("Something went wrong", "error");
        }
    };

    const handleDeleteClass = async () => {
        setShowDeleteConfirm(false);
        try {
            const res = await fetch(`/api/classes?id=${classId}`, { method: "DELETE" });
            if (res.ok) {
                showToast("Class deleted", "info");
                router.push('/classes');
                router.refresh();
            } else {
                showToast("Failed to delete class", "error");
            }
        } catch {
            showToast("Something went wrong", "error");
        }
    };

    const avgXP = students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.xp || 0), 0) / students.length) : 0;
    const totalSolved = students.reduce((acc, s) => acc + (s.solvedCount || 0), 0);
    const activeTask = assignedTasks.find(at => at.taskId === activeAssignmentId);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-2xl">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white leading-tight">{className}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-stone-500 text-xs font-bold uppercase tracking-widest">Join Code:</span>
                            <code className="bg-black/40 px-2 py-0.5 rounded text-indigo-400 font-mono font-bold text-sm tracking-widest">{joinCode}</code>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowAssignModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Assign Task
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-500/60 hover:text-red-400 text-sm font-bold flex items-center gap-2 transition-colors px-4 py-3 hover:bg-red-500/10 rounded-2xl">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Class
                    </button>

                    <ConfirmModal 
                        isOpen={showDeleteConfirm}
                        title="Delete Class"
                        message="Are you sure? This will remove all students from this class and delete all assignments. This action cannot be undone."
                        confirmLabel="Delete Everything"
                        cancelLabel="Keep Class"
                        onConfirm={handleDeleteClass}
                        onCancel={() => setShowDeleteConfirm(false)}
                        isDestructive={true}
                    />
                </div>
            </div>

            {assignedTasks.length > 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-[28px]">
                    <div className="flex items-center justify-between mb-4 gap-4">
                        <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            Filter by Assignment ({assignedTasks.length})
                        </span>
                        {assignedTasks.length > 4 && (
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={taskSearch}
                                onChange={e => setTaskSearch(e.target.value)}
                                className="bg-black border border-neutral-800 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-all w-48"
                            />
                        )}
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                        {/* Overview pill */}
                        <button
                            onClick={() => setActiveAssignmentId(null)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all ${
                                activeAssignmentId === null
                                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                    : 'bg-black border-neutral-800 text-stone-400 hover:border-indigo-500/40 hover:text-white'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Overview
                        </button>

                        {/* Task pills */}
                        {assignedTasks
                            .filter(at => !taskSearch || at.task?.name?.toLowerCase().includes(taskSearch.toLowerCase()))
                            .map(at => {
                                const isActive = activeAssignmentId === at.taskId;
                                const pct = at.studentCount > 0 ? Math.round((at.completedCount / at.studentCount) * 100) : 0;
                                return (
                                    <div key={at.taskId} className="flex-shrink-0 relative group/pill">
                                        <button
                                            onClick={() => setActiveAssignmentId(isActive ? null : at.taskId)}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all pr-8 ${
                                                isActive
                                                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                    : 'bg-black border-neutral-800 text-stone-400 hover:border-indigo-500/40 hover:text-white'
                                            }`}
                                        >
                                            <span className="max-w-[160px] truncate">{at.task?.name}</span>
                                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                                                isActive ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-stone-400'
                                            }`}>
                                                {pct}%
                                            </span>
                                        </button>
                                        <button
                                            onClick={e => { e.stopPropagation(); handleUnassignTask(at.taskId); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover/pill:opacity-100 transition-opacity hover:text-red-400 text-stone-600"
                                            title="Unassign"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            ) : (
                <div className="bg-neutral-900/50 border border-neutral-800/50 p-8 rounded-[28px] text-center">
                    <p className="text-stone-600 text-sm font-medium italic">
                        No tasks assigned to this class yet. Click <span className="text-indigo-400 font-bold">"Assign Task"</span> to get started.
                    </p>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[32px] shadow-xl">
                    <div className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Students Enrolled</div>
                    <div className="text-5xl font-black text-white">{students.length}</div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[32px] shadow-xl">
                    <div className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">
                        {activeAssignmentId ? 'Completed Assignment' : 'Average XP'}
                    </div>
                    <div className="text-5xl font-black text-emerald-500">
                        {activeAssignmentId
                            ? `${activeTask?.completedCount ?? 0}/${activeTask?.studentCount ?? 0}`
                            : avgXP}
                    </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[32px] shadow-xl">
                    <div className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">
                        {activeAssignmentId ? 'Completion Rate' : 'Total Solutions'}
                    </div>
                    <div className="text-5xl font-black text-indigo-500">
                        {activeAssignmentId
                            ? `${activeTask?.studentCount ? Math.round((activeTask.completedCount / activeTask.studentCount) * 100) : 0}%`
                            : totalSolved}
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden shadow-2xl">
                {activeAssignmentId && (
                    <div className="px-8 py-4 bg-indigo-600/10 border-b border-indigo-500/20 flex items-center gap-3">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        <span className="text-indigo-300 text-xs font-black uppercase tracking-widest">
                            Filtered by: {activeTask?.task?.name}
                        </span>
                        <button onClick={() => setActiveAssignmentId(null)}
                            className="ml-auto text-stone-600 hover:text-white text-xs font-bold transition-colors">
                            Clear filter ×
                        </button>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 border-b border-neutral-800">
                                <th className="px-8 py-5 text-stone-400 font-bold text-xs uppercase tracking-widest">Student</th>
                                <th className="px-8 py-5 text-stone-400 font-bold text-xs uppercase tracking-widest text-center">
                                    {activeAssignmentId ? 'Status' : 'Total XP'}
                                </th>
                                <th className="px-8 py-5 text-stone-400 font-bold text-xs uppercase tracking-widest text-center">
                                    {activeAssignmentId ? 'Submitted At' : 'Tasks Solved'}
                                </th>
                                <th className="px-8 py-5 text-stone-400 font-bold text-xs uppercase tracking-widest text-center">
                                    {activeAssignmentId ? 'On Time' : 'Overall Progress'}
                                </th>
                                {activeAssignmentId ? (
                                    <th className="px-8 py-5 text-stone-400 font-bold text-xs uppercase tracking-widest">Action</th>
                                ) : (
                                    <th className="px-8 py-5 text-stone-400 font-bold text-xs uppercase tracking-widest text-right">Joined</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-stone-500 font-medium">
                                        Loading class records...
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-stone-500 font-medium text-lg mb-2">No students have joined this class yet.</p>
                                        <p className="text-stone-600 text-sm">
                                            Share the Join Code <span className="text-indigo-400 font-mono font-bold uppercase">{joinCode}</span> with your students.
                                        </p>
                                    </td>
                                </tr>
                            ) : students.map(student => {
                                const progressPercent = student.totalTasks > 0
                                    ? ((student.solvedCount || 0) / student.totalTasks) * 100
                                    : 0;
                                return (
                                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold group-hover:text-indigo-400 transition-colors">{student.name}</span>
                                                <span className="text-stone-500 text-xs font-medium">{student.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {activeAssignmentId ? (
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                                    student.taskStatus === 'SOLVED'
                                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                        : student.taskStatus === 'IN_PROGRESS'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        : 'bg-stone-800 text-stone-500'
                                                }`}>
                                                    {student.taskStatus === 'IN_PROGRESS' ? 'SUBMITTED' : (student.taskStatus?.replace(/_/g, ' ') || 'NOT STARTED')}
                                                </span>
                                            ) : (
                                                <span className="font-black text-white text-xl">{student.xp}</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {activeAssignmentId ? (
                                                student.submittedAt ? (
                                                    <span className="text-stone-300 text-xs font-bold">
                                                        {new Date(student.submittedAt).toLocaleString([], {
                                                            dateStyle: 'short', timeStyle: 'short'
                                                        })}
                                                    </span>
                                                ) : (
                                                    <span className="text-stone-700 text-xs font-bold">—</span>
                                                )
                                            ) : (
                                                <span className="text-stone-300 font-bold bg-neutral-800 px-3 py-1 rounded-lg">
                                                    {student.solvedCount} / {student.totalTasks}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {activeAssignmentId ? (
                                                student.onTime === true ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">On Time</span>
                                                ) : student.onTime === false ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">Late</span>
                                                ) : student.submittedAt ? (
                                                    <span className="text-stone-500 text-[10px] font-bold uppercase">No deadline</span>
                                                ) : (
                                                    <span className="text-stone-700 text-xs font-bold">—</span>
                                                )
                                            ) : (
                                                <div className="w-full">
                                                    <div className="flex justify-between text-[10px] text-stone-500 mb-1.5 font-bold uppercase tracking-widest">
                                                        <span>Overall Progress</span>
                                                        <span>{Math.round(progressPercent)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                            style={{ width: `${progressPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className={`px-8 py-5 ${!activeAssignmentId ? 'text-right' : ''}`}>
                                            {activeAssignmentId ? (
                                                student.taskStatus === 'SOLVED' || student.taskStatus === 'IN_PROGRESS' ? (
                                                    <button
                                                        onClick={() => handleViewSolution(student)}
                                                        className="text-indigo-400 hover:text-white hover:bg-indigo-600 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/30 hover:border-indigo-400 ml-auto"
                                                    >
                                                        View Solution
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <span className="text-stone-700 text-xs font-bold">No submission</span>
                                                )
                                            ) : (
                                                <span className="text-stone-500 text-sm font-medium">
                                                    {new Date(student.joinedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Task Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        <h2 className="text-3xl font-black mb-8 text-white text-center">Assign Task</h2>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1">Select Programming Task</label>
                                <select
                                    className="w-full bg-black border border-neutral-800 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                    value={selectedTaskId}
                                    onChange={e => setSelectedTaskId(e.target.value)}
                                >
                                    <option value="">-- Choose a task --</option>
                                    {allTasks.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.xp} XP)</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1">Completion Deadline (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full bg-black border border-neutral-800 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all"
                                    value={taskDueDate}
                                    onChange={e => setTaskDueDate(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowAssignModal(false)}
                                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-black py-5 rounded-3xl transition-all active:scale-95">
                                    Cancel
                                </button>
                                <button onClick={handleAssignTask} disabled={!selectedTaskId}
                                    className="flex-1 bg-white text-black font-black py-5 rounded-3xl shadow-xl transition-all active:scale-95 disabled:opacity-50">
                                    Confirm Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Viewer Modal */}
            {submissionStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-black/40">
                            <div>
                                <div className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">Solution Review</div>
                                <h3 className="text-xl font-black text-white">
                                    {submissionStudent.name}
                                    {submission && <span className="text-stone-400 font-normal"> · {submission.taskName}</span>}
                                </h3>
                            </div>
                            <button onClick={() => { setSubmissionStudent(null); setSubmission(null); }}
                                className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-stone-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {submissionLoading ? (
                            <div className="flex items-center justify-center py-24 text-stone-500 font-bold">
                                Loading submission...
                            </div>
                        ) : !submission ? (
                            <div className="flex flex-col items-center justify-center py-24 text-stone-500">
                                <p className="font-bold text-lg">No submission found</p>
                                <p className="text-sm mt-1">This student may not have submitted yet.</p>
                            </div>
                        ) : (
                            <>
                                {/* Meta bar */}
                                <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-neutral-800 bg-black/20">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                        submission.status === 'SOLVED'
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    }`}>
                                        {submission.status === 'IN_PROGRESS' ? 'SUBMITTED' : submission.status.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-stone-500 text-xs font-bold uppercase">
                                        {submission.language}
                                    </span>
                                    <span className="text-stone-300 text-xs font-bold">
                                        <span className="text-emerald-400">+{submission.xpEarned}</span> / {submission.taskXP} XP
                                    </span>
                                    <span className="text-stone-500 text-xs font-bold">
                                        {submission.results.filter(r => r.passed).length} / {submission.results.length} tests passed
                                    </span>
                                    <span className="text-stone-600 text-[10px] font-medium ml-2">
                                        Submitted {new Date(submission.submittedAt).toLocaleString()}
                                    </span>
                                    <div className="ml-auto flex flex-wrap items-center gap-2 max-w-[200px] justify-end">
                                        <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest mr-1">Tests</span>
                                        {submission.results.map((r, i) => (
                                            <div 
                                                key={i} 
                                                title={`${r.isHidden ? 'Hidden Test' : 'Test ' + (i + 1)}: ${r.passed ? 'PASSED' : 'FAILED'}`}
                                                className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-all ${
                                                    r.passed 
                                                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                                                        : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                                                } ${r.isHidden ? 'opacity-50 grayscale-[0.5]' : ''}`}
                                            >
                                                {r.isHidden && (
                                                    <svg className="w-2 h-2 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Code */}
                                <div className="overflow-auto flex-1 p-6">
                                    <pre className="bg-black border border-neutral-800 rounded-2xl p-6 text-sm text-stone-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
                                        <code>{submission.code}</code>
                                    </pre>
                                </div>

                                <div className="p-6 pt-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-stone-500 text-[10px] font-black uppercase tracking-widest">Test Case Details</h4>
                                        <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest">
                                            {submission.results.filter(r => r.passed).length} / {submission.results.length} PASSED
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {submission.results.length === 0 ? (
                                            <div className="text-center py-8 text-stone-600 bg-black/20 rounded-2xl border border-dashed border-stone-800">
                                                No test results were recorded for this submission.
                                            </div>
                                        ) : (
                                            submission.results.map((r, i) => (
                                                <div key={i} className={`p-4 rounded-2xl border transition-all ${
                                                    r.passed 
                                                        ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20' 
                                                        : 'bg-red-500/5 border-red-500/10 hover:border-red-500/20'
                                                }`}>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${r.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                            <span className="text-xs font-bold text-stone-300">
                                                                {r.isHidden ? 'Hidden Test Case' : `Test Case #${i + 1}`}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                            r.passed ? 'text-emerald-500' : 'text-red-400'
                                                        }`}>
                                                            {r.passed ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest">Input</span>
                                                            <div className="text-[11px] bg-black/40 p-2.5 rounded-xl font-mono text-stone-400 border border-neutral-800/50 overflow-x-auto max-h-32">
                                                                {r.input || '—'}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest">Expected Output</span>
                                                            <div className="text-[11px] bg-black/40 p-2.5 rounded-xl font-mono text-emerald-500/60 border border-neutral-800/50 overflow-x-auto max-h-32">
                                                                {r.expectedOutput || '—'}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest">Student Output</span>
                                                            <div className={`text-[11px] bg-black/40 p-2.5 rounded-xl font-mono border border-neutral-800/50 overflow-x-auto max-h-32 ${
                                                                r.passed ? 'text-stone-400' : 'text-red-400'
                                                            }`}>
                                                                {r.actualOutput || '—'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
