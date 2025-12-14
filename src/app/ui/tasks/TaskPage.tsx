'use client';

import React, { useState } from 'react';
import { tasks } from '../../lib/placeholder-data';
import CodeEditor from './CodeEditor';
import SolutionSuccessModal from './SolutionSuccessModal';

interface TestResult {
    testName: string;
    passed: boolean;
    input?: any;
    expected?: any;
    actual?: any;
    error?: string;
    isOpen?: boolean;
}

const TaskPage = ({ taskId }: { taskId: string; }) => {
    const [userCode, setUserCode] = useState('');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [openTests, setOpenTests] = useState<Set<number>>(new Set());
    const [testsHavePassed, setTestsHavePassed] = useState(false);
    
    const targetIndex = parseInt(taskId, 10);
    const task = tasks.find(t => t.index === targetIndex);

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!task) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-stone-300 text-center text-xl">
                    Task with ID {taskId} not found.
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
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setTestResults([
            { testName: 'Test 1', passed: true, expected: 'Hello world', actual: 'Hello world', isOpen: false },
            { testName: 'Test 2', passed: true, expected: 'Hello world', actual: 'Hello world', isOpen: false },
            { testName: 'Test 3', passed: true, expected: 'Hello world', actual: 'Hello world', isOpen: false }
        ]);
        
        setTestsHavePassed(true);
        setIsRunning(false);
    };

    const handleSubmit = () => {
        console.log('Submitting solution:', userCode);
        setIsModalOpen(true);
    };

    const nextTaskIndex = task.index + 1;
    const nextTask = tasks.find(t => t.index === nextTaskIndex);
    
    const nextTaskName = nextTask ? nextTask.name : "No more tasks";
    const nextTaskCategory = nextTask ? nextTask.tags[0] : "";

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
            
            <div style={{ 
                height: 'calc(100vh - 110px)',
                display: 'flex', 
                flexDirection: 'row', 
                gap: '1.5rem', 
                padding: '1.5rem',
                marginTop: '60px',
                overflow: 'hidden'
            }}>

                <div style={{ flex: 1, backgroundColor: '#171717', borderRadius: '1rem', border: '1px solid #404040', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }}>
                    
                    <div style={{ height: '3rem', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid #404040', flexShrink: 0 }}>
                        <div style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Task description</div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '1.5rem' }}>
                        
                        <h2 style={{ color: '#d6d3d1', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid #404040', fontSize: '1.5rem', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            {task.index}. {task.name}
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

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden', minHeight: 0, minWidth: 0 }}>
                    
                    <div style={{ flex: 1, borderRadius: '1rem', border: '1px solid #404040', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#171717', minHeight: 0 }}>
                        <div style={{ height: '3rem', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid #404040', flexShrink: 0 }}>
                            <div style={{ color: '#d6d3d1', fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Code Editor</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#171717', overflow: 'hidden', minHeight: 0 }}>
                            <CodeEditor 
                                language="c"
                                defaultValue='#include <stdio.h>\n\nint main() {\n    printf("Hello world");\n    return 0;\n}\n'
                                onChange={handleCodeChange}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, backgroundColor: '#171717', borderRadius: '1rem', border: '1px solid #404040', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
                                                            Expected: <span style={{ color: '#4ade80', fontFamily: 'monospace' }}>{JSON.stringify(result.expected)}</span>
                                                        </div>
                                                        <div style={{ wordBreak: 'break-all' }}>
                                                            Got: <span style={{ color: result.passed ? '#4ade80' : '#f87171', fontFamily: 'monospace' }}>{JSON.stringify(result.actual)}</span>
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
                    disabled={!testsHavePassed}
                    style={{ 
                        height: '2.5rem', 
                        padding: '0 1.5rem', 
                        backgroundColor: testsHavePassed ? '#22c55e' : '#4b5563', 
                        borderRadius: '0.5rem', 
                        border: testsHavePassed ? '2px solid #000' : '2px solid #374151', 
                        color: testsHavePassed ? '#000' : '#9ca3af', 
                        fontSize: '1rem', 
                        fontWeight: 600,
                        cursor: testsHavePassed ? 'pointer' : 'not-allowed'
                    }}
                >
                    Submit Solution
                </button>
            </div>

            {isModalOpen && (
                <SolutionSuccessModal
                    score={100}
                    xpGained={task.xp}
                    nextTaskName={nextTaskName}
                    nextTaskCategory={nextTaskCategory}
                    onClose={() => {
                        setIsModalOpen(false);
                        window.location.href = '/learn';
                    }}
                    onGoToStats={() => {
                        window.location.href = '/statistics';
                    }}
                    onGoToNextTask={() => {
                        if (nextTask) {
                            window.location.href = `/tasks/${nextTaskIndex}`;
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