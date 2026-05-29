'use client';

import React, { useState } from 'react';
import CodeEditor from '@/ui/tasks/CodeEditor';
import SolutionSuccessModal from './SolutionSuccessModal';

interface TestResult {
    testCaseId: number;
    testName: string;
    passed: boolean;
    input?: any;
    expected?: any;
    actual?: any;
    error?: string;
    isOpen?: boolean;
}

const TaskPage = ({ task }: { task: any; }) => {
    const initialCode = task.lastSubmittedCode || '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}\n';
    const [userCode, setUserCode] = useState(initialCode);
    const initialResults = task.lastSubmittedResults || [];
    const [testResults, setTestResults] = useState<TestResult[]>(initialResults);
    const [isRunning, setIsRunning] = useState(false);
    const [openTests, setOpenTests] = useState<Set<number>>(new Set(initialResults.filter((r: any) => !r.passed).map((_: any, i: number) => i)));
    const [testsHavePassed, setTestsHavePassed] = useState(initialResults.length > 0 && initialResults.every((r: any) => r.passed));

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!task) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-stone-300 text-center text-xl">
                    Task not found.
                </div>
            </div>
        );
    }

    const details = task.details;

    const handleCodeChange = (value: string | undefined) => {
        setUserCode(value || '');
    };

    const toggleTest = (index: number) => {
        if (testResults.length === 0) return;

        const newOpenTests = new Set(openTests);
        if (newOpenTests.has(index)) {
            newOpenTests.delete(index);
        } else {
            newOpenTests.add(index);
        }
        setOpenTests(newOpenTests);
    };

    const handleRunTests = async () => {
        setIsRunning(true);
        setTestResults([]);
        setOpenTests(new Set());
        setTestsHavePassed(false);

        try {
            const response = await fetch(`/api/tasks/${task.id}/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: userCode,
                    language: 'c',
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert('Error running tests: ' + data.error);
                setIsRunning(false);
                return;
            }

            const results = data.results.map((r: any) => ({
                ...r,
                isOpen: !r.passed && !r.isHidden
            }));

            setTestResults(results);
            setTestsHavePassed(results.every((r: any) => r.passed));
        } catch (error) {
            console.error('Failed to run tests:', error);
            alert('An unexpected error occurred while running tests.');
        } finally {
            setIsRunning(false);
        }
    };

    const [submissionInfo, setSubmissionInfo] = useState<{ xpEarned: number; score: number } | null>(null);

    const handleSubmit = async () => {
        if (!userCode || testResults.length === 0) {
            alert('Please run tests before submitting.');
            return;
        }

        setIsRunning(true);
        try {
            console.log('Submitting solution for task:', task.id);
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId: task.id,
                    code: userCode,
                    language: 'c',
                    results: testResults
                }),
            });

            const data = await response.json();
            if (data.success) {
                const passed = testResults.filter(r => r.passed).length;
                const total = testResults.length;
                const score = total > 0 ? Math.round((passed / total) * 100) : 0;
                setSubmissionInfo({ xpEarned: data.xpEarned, score });
                setIsModalOpen(true);
            } else {
                alert('Failed to save submission: ' + data.error);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred while submitting.');
        } finally {
            setIsRunning(false);
        }
    };

    const nextTaskId = task.nextTaskId;
    const nextTaskName = task.nextTaskName || "Next Task";
    const nextTaskCategory = task.nextTaskCategory || "General";

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000',
            color: '#d6d3d1',
            overflow: 'hidden'
        }}>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 mt-[60px] h-[calc(100vh-110px)] overflow-y-auto lg:overflow-hidden">

                <div className="flex-1 bg-[#171717] rounded-2xl border border-[#404040] overflow-hidden flex flex-col min-h-[400px] lg:min-h-0 min-w-0 shrink-0 lg:shrink">

                    <div style={{ height: '3rem', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid #404040', flexShrink: 0 }}>
                        <div style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Task description</div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '1.5rem' }}>

                        <h2 style={{ color: '#d6d3d1', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid #404040', fontSize: '1.5rem', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            {task.name}
                        </h2>

                        <section style={{ marginBottom: '1rem' }}>
                            <h3 style={{ color: '#d6d3d1', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Task:</h3>
                            <p style={{ color: '#d6d3d1', fontSize: '1rem', lineHeight: '1.625' }}>
                                {details.description}
                            </p>
                        </section>

                        <section style={{ marginBottom: '1rem' }}>
                            <h3 style={{ color: '#d6d3d1', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Input:</h3>
                            <p style={{ color: '#d6d3d1', fontSize: '1rem', lineHeight: '1.625' }}>
                                {details.inputDescription}
                            </p>
                        </section>

                        <section style={{ marginBottom: '1rem' }}>
                            <h3 style={{ color: '#d6d3d1', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Output:</h3>
                            <p style={{ color: '#d6d3d1', fontSize: '1rem', lineHeight: '1.625' }}>
                                {details.outputDescription}
                            </p>
                        </section>

                        <section style={{ marginBottom: '1rem' }}>
                            <h3 style={{ color: '#d6d3d1', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Example:</h3>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <h4 style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Input:</h4>
                                <div style={{ padding: '1rem', backgroundColor: '#262626', borderRadius: '0.5rem', border: '1px solid #404040', color: '#e5e5e5', fontSize: '1rem', fontFamily: 'monospace', whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                                    {details.exampleInput}
                                </div>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <h4 style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Output:</h4>
                                <div style={{ padding: '1rem', backgroundColor: '#262626', borderRadius: '0.5rem', border: '1px solid #404040', color: '#e5e5e5', fontSize: '1rem', fontFamily: 'monospace', whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                                    {details.exampleOutput}
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 style={{ color: '#d6d3d1', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Constraints:</h3>
                            <p style={{ color: '#d6d3d1', fontSize: '1rem', lineHeight: '1.625' }}>
                                {details.constraints}
                            </p>
                        </section>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4 lg:gap-6 overflow-hidden min-h-[600px] lg:min-h-0 min-w-0 shrink-0 lg:shrink">

                    <div className="flex-1 bg-[#171717] rounded-2xl border border-[#404040] overflow-hidden flex flex-col min-h-[300px] lg:min-h-0">
                        <div style={{ height: '3rem', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid #404040', flexShrink: 0 }}>
                            <div style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Code Editor</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#171717', overflow: 'hidden', minHeight: 0 }}>
                            <CodeEditor
                                language="cpp"
                                defaultValue={initialCode}
                                onChange={handleCodeChange}
                            />
                        </div>
                    </div>

                    <div className="flex-1 bg-[#171717] rounded-2xl border border-[#404040] overflow-hidden flex flex-col min-h-[250px] lg:min-h-0">
                        <div style={{ height: '3rem', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid #404040', flexShrink: 0 }}>
                            <div style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Console</div>
                        </div>

                        <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', minHeight: 0 }}>

                            {isRunning && (
                                <div style={{ color: '#a8a29e', fontSize: '0.875rem' }}>Compiling and running...</div>
                            )}

                            {testResults.length === 0 ? (
                                ['Test 1', 'Test 2', 'Test 3'].map((testName, index) => (
                                    <div
                                        key={testName}
                                        style={{ padding: '0.75rem', backgroundColor: '#262626', borderRadius: '0.5rem', border: '1px solid #525252', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5, cursor: 'not-allowed', flexShrink: 0 }}
                                    >
                                        <div style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{testName}</div>
                                        <svg style={{ width: '1.25rem', height: '1.25rem', color: '#a8a29e', flexShrink: 0 }} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                ))
                            ) : (
                                testResults.map((result, index) => (
                                    <div key={index} style={{ flexShrink: 0 }}>
                                        <div
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: `1px solid ${result.passed ? '#16a34a' : '#dc2626'}`,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: result.passed ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)'
                                            }}
                                            onClick={() => toggleTest(index)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                                                <div style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.testName}</div>
                                                {result.passed ? (
                                                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#22c55e', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <svg
                                                style={{
                                                    width: '1.25rem',
                                                    height: '1.25rem',
                                                    color: '#a8a29e',
                                                    transform: openTests.has(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.2s',
                                                    flexShrink: 0
                                                }}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>

                                        {openTests.has(index) && (
                                            <div style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '0.5rem', backgroundColor: result.passed ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)' }}>
                                                {result.error ? (
                                                    <div style={{ color: '#f87171', fontSize: '0.875rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.error}</div>
                                                ) : (
                                                    <div style={{ color: '#a8a29e', fontSize: '0.875rem' }}>
                                                        <div style={{ wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                                                            Input: <span style={{ color: '#d6d3d1', fontFamily: 'monospace', whiteSpace: 'pre-wrap', display: 'block', marginTop: '0.25rem', backgroundColor: '#171717', padding: '0.5rem', borderRadius: '0.25rem' }}>{String(result.input)}</span>
                                                        </div>
                                                        <div style={{ wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                                                            Expected: <span style={{ color: '#4ade80', fontFamily: 'monospace', whiteSpace: 'pre-wrap', display: 'block', marginTop: '0.25rem', backgroundColor: '#171717', padding: '0.5rem', borderRadius: '0.25rem' }}>{String(result.expected)}</span>
                                                        </div>
                                                        <div style={{ wordBreak: 'break-all' }}>
                                                            Got: <span style={{ color: result.passed ? '#4ade80' : '#f87171', fontFamily: 'monospace', whiteSpace: 'pre-wrap', display: 'block', marginTop: '0.25rem', backgroundColor: '#171717', padding: '0.5rem', borderRadius: '0.25rem' }}>{String(result.actual)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                padding: '0 1.5rem',
                backgroundColor: '#000',
                borderTop: '1px solid #262626',
                zIndex: 10
            }}>
                <button
                    onClick={handleRunTests}
                    disabled={isRunning}
                    style={{
                        height: '2.5rem',
                        padding: '0 1.5rem',
                        backgroundColor: '#22c55e',
                        borderRadius: '0.5rem',
                        border: '2px solid #000',
                        color: '#000',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        opacity: isRunning ? 0.5 : 1
                    }}
                >
                    {isRunning ? 'Compiling...' : 'Run Tests'}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={testResults.length === 0}
                    style={{
                        height: '2.5rem',
                        padding: '0 1.5rem',
                        backgroundColor: testResults.length > 0 ? '#22c55e' : '#4b5563',
                        borderRadius: '0.5rem',
                        border: testResults.length > 0 ? '2px solid #000' : '2px solid #374151',
                        color: testResults.length > 0 ? '#000' : '#9ca3af',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: testResults.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                >
                    Submit Solution
                </button>
            </div>

            {isModalOpen && submissionInfo && (
                <SolutionSuccessModal
                    score={submissionInfo.score}
                    xpGained={submissionInfo.xpEarned}
                    nextTaskName={nextTaskName}
                    nextTaskCategory={nextTaskCategory}
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                    onGoBack={() => {
                        window.location.href = '/learn';
                    }}
                    onGoToStats={() => {
                        window.location.href = '/statistics';
                    }}
                    onGoToNextTask={() => {
                        if (nextTaskId) {
                            window.location.href = `/tasks/${nextTaskId}`;
                        } else {
                            window.location.href = '/learn';
                        }
                    }}
                />
            )}
        </div>
    );
};

export default TaskPage;