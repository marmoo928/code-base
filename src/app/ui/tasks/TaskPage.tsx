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

/**
 * Functional component for rendering a single task page.
 * @param {object} props - Component properties
 * @param {string} props.taskId - The index of the task to display (e.g., '1', '2', '3')
 */
const TaskPage = ({ taskId }: { taskId: string; }) => {
    const [userCode, setUserCode] = useState('');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [openTests, setOpenTests] = useState<Set<number>>(new Set());
    
    // 1. Fetch the data for the specific task using the ID from the route
    const targetIndex = parseInt(taskId, 10);
    const task = tasks.find(t => t.index === targetIndex);

    // 2. ADD STATE FOR MODAL VISIBILITY
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
        if (testResults.length === 0) return; // Don't allow opening until tests are run
        
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
        setOpenTests(new Set()); // Close all tests when running
        
        try {
            // Call our API route instead of JDoodle directly (avoids CORS)
            const response = await fetch('/api/run-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: userCode,
                }),
            });
            
            const data = await response.json();
            
            if (data.error) {
                setTestResults([{
                    testName: 'Compilation Error',
                    passed: false,
                    error: data.error,
                    isOpen: false,
                }]);
            } else {
                // Check if output matches "Hello world"
                const output = data.output?.trim() || '';
                const passed = output === 'Hello world';
                
                setTestResults([
                    { testName: 'Test 1', passed, expected: 'Hello world', actual: output, isOpen: false },
                    { testName: 'Test 2', passed, expected: 'Hello world', actual: output, isOpen: false },
                    { testName: 'Test 3', passed, expected: 'Hello world', actual: output, isOpen: false }
                ]);
            }
            
        } catch (error: any) {
            console.error('Code execution error:', error);
            setTestResults([{
                testName: 'Execution Error',
                passed: false,
                error: error.message,
                isOpen: false,
            }]);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = () => {
        console.log('Submitting solution:', userCode);
        
        // For demonstration, we'll assume a success and open the modal
        setIsModalOpen(true); 

        // NOTE: In a real app, you would only call setIsModalOpen(true) 
        // IF the submission and final tests passed successfully.
    };

    // Calculate total height needed for open tests
    const anyTestOpen = openTests.size > 0;

    return (
        // Main container - NO OVERFLOW, fixed height
        <div className="h-full text-stone-300 flex flex-col p-6 gap-6 overflow-hidden">
            
            {/* Top Row: Task Description + Code Editor & Console */}
            <div className="flex-1 flex gap-6 overflow-hidden min-h-0">

                {/* --- LEFT PANEL: Task Description (Full Height) --- */}
                <div className="flex-1 bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden flex flex-col shadow-xl">
                    
                    {/* Header (Task description) */}
                    <div className="h-12 bg-zinc-800 flex items-center px-6 border-b border-neutral-700 flex-shrink-0">
                        <div className="text-stone-300 text-base font-medium">Task description</div>
                    </div>

                    {/* Content Area - Scrollable only inside this panel */}
                    <div 
                        className="flex-1 flex flex-col overflow-y-auto"
                        style={{ paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '1rem', paddingBottom: '1.5rem' }}
                    >
                        
                        {/* Task Title */}
                        <h2 
                            className="text-stone-300 font-semibold text-center border-b border-neutral-700"
                            style={{ fontSize: '1.5rem', paddingBottom: '1rem' }}
                        >
                            {task.index}. {task.name}
                        </h2>
                        
                        <div className="flex-1 min-h-4"></div>
                        
                        {/* Task: Description */}
                        <section className="space-y-3">
                            <h3 className="text-stone-300 font-semibold" style={{ fontSize: '1.25rem' }}>Task:</h3>
                            <p className="text-stone-300 text-base leading-relaxed">
                                {details.description}
                            </p>
                        </section>

                        <div className="flex-1 min-h-4"></div>

                        {/* Input */}
                        <section className="space-y-3">
                            <h3 className="text-stone-300 font-semibold" style={{ fontSize: '1.25rem' }}>Input:</h3>
                            <p className="text-stone-300 text-base leading-relaxed">
                                {details.inputDescription}
                            </p>
                        </section>
                        
                        <div className="flex-1 min-h-4"></div>
                        
                        {/* Output */}
                        <section className="space-y-3">
                            <h3 className="text-stone-300 font-semibold" style={{ fontSize: '1.25rem' }}>Output:</h3>
                            <p className="text-stone-300 text-base leading-relaxed">
                                {details.outputDescription}
                            </p>
                        </section>

                        <div className="flex-1 min-h-4"></div>

                        {/* Example Section */}
                        <section className="space-y-4">
                            <h3 className="text-stone-300 font-semibold" style={{ fontSize: '1.25rem' }}>Example:</h3>
                            
                            {/* Example Input */}
                            <div className="space-y-2">
                                <h4 className="text-stone-300 text-base font-medium">Input:</h4>
                                <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 text-neutral-200 text-base font-mono whitespace-pre-line">
                                    {details.exampleInput}
                                </div>
                            </div>
                            
                            {/* Example Output */}
                            <div className="space-y-2">
                                <h4 className="text-stone-300 text-base font-medium">Output:</h4>
                                <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 text-neutral-200 text-base font-mono whitespace-pre-line">
                                    {details.exampleOutput}
                                </div>
                            </div>
                        </section>

                        <div className="flex-1 min-h-4"></div>

                        {/* Constraints */}
                        <section className="space-y-3">
                            <h3 className="text-stone-300 font-semibold" style={{ fontSize: '1.25rem' }}>Constraints:</h3>
                            <p className="text-stone-300 text-base leading-relaxed">
                                {details.constraints}
                            </p>
                        </section>
                    </div>
                </div>

                {/* --- RIGHT SIDE: Code Editor (Top) + Console (Bottom) --- */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
                    
                    {/* RIGHT TOP PANEL: Code Editor - Dynamic height */}
                    <div 
                        className="rounded-2xl border border-neutral-700 overflow-hidden flex flex-col bg-neutral-900 shadow-xl min-h-0 transition-all duration-300"
                        style={{ 
                            flex: anyTestOpen ? '0 0 35%' : '0 0 55%'
                        }}
                    >
                        {/* Header (Code Editor) */}
                        <div className="h-12 bg-zinc-800 flex items-center px-6 border-b border-neutral-700 flex-shrink-0">
                            <div className="text-stone-300 text-base font-medium">Code Editor</div>
                        </div>
                        {/* Monaco Code Editor */}
                        <div className="flex-grow bg-neutral-900 overflow-hidden">
                            <CodeEditor 
                                language="c"
                                defaultValue='#include <stdio.h>\n\nint main() {\n    printf("Hello world");\n    return 0;\n}\n'
                                onChange={handleCodeChange}
                            />
                        </div>
                    </div>

                    {/* RIGHT BOTTOM PANEL: Console - Dynamic height based on open state */}
                    <div 
                        className="bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden flex flex-col shadow-xl transition-all duration-300"
                        style={{ 
                            flex: '1 1 auto'
                        }}
                    >
                        {/* Header (Console) */}
                        <div className="h-12 bg-zinc-800 flex items-center px-6 border-b border-neutral-700 flex-shrink-0">
                            <div className="text-stone-300 text-base font-medium">Console</div>
                        </div>
                        
                        {/* Console Content Area - Scrollable when tests are open */}
                        <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                            
                            {/* Show running state */}
                            {isRunning && (
                                <div className="text-stone-400 text-sm">Compiling and running...</div>
                            )}
                            
                            {/* Test Result Items */}
                            {testResults.length === 0 ? (
                                ['Test 1', 'Test 2', 'Test 3'].map((testName, index) => (
                                    <div 
                                        key={testName} 
                                        className="p-3 bg-neutral-800 rounded-lg border border-neutral-600 flex justify-between items-center opacity-50 cursor-not-allowed"
                                    >
                                        <div className="text-stone-300 text-base font-medium">{testName}</div>
                                        <svg 
                                            className="w-5 h-5 text-stone-400"
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                ))
                            ) : (
                                testResults.map((result, index) => (
                                    <div key={index}>
                                        <div 
                                            className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-colors ${
                                                result.passed 
                                                    ? 'bg-green-900/20 border-green-600 hover:border-green-500' 
                                                    : 'bg-red-900/20 border-red-600 hover:border-red-500'
                                            }`}
                                            onClick={() => toggleTest(index)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-stone-300 text-base font-medium">{result.testName}</div>
                                                {result.passed ? (
                                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <svg 
                                                className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${openTests.has(index) ? 'rotate-180' : ''}`}
                                                viewBox="0 0 20 20" 
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        
                                        {/* Expandable content */}
                                        {openTests.has(index) && (
                                            <div className={`mt-2 p-4 rounded-lg ${
                                                result.passed ? 'bg-green-900/10' : 'bg-red-900/10'
                                            }`}>
                                                {result.error ? (
                                                    <div className="text-red-400 text-sm font-mono">{result.error}</div>
                                                ) : (
                                                    <div className="text-stone-400 text-sm space-y-2">
                                                        <div>
                                                            Expected: <span className="text-green-400 font-mono">{JSON.stringify(result.expected)}</span>
                                                        </div>
                                                        <div>
                                                            Got: <span className={(result.passed ? 'text-green-400' : 'text-red-400') + ' font-mono'}>{JSON.stringify(result.actual)}</span>
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

            {/* Bottom Row: Action Buttons - Full width below both columns */}
            <div className="flex justify-end gap-3 flex-shrink-0">
                {/* Run Tests Button */}
                <button 
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="h-11 px-6 bg-green-500 rounded-xl border-2 border-black text-black text-lg font-semibold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRunning ? 'Compiling...' : 'Run Tests'}
                </button>
                {/* Submit Solution Button */}
                <button 
                    onClick={handleSubmit}
                    className="h-11 px-6 bg-green-500 rounded-xl border-2 border-black text-black text-lg font-semibold hover:bg-green-400 transition-colors"
                >
                    Submit Solution
                </button>
            </div>
            {/* 4. CONDITIONAL MODAL RENDER AT THE BOTTOM OF THE RETURN */}
            {isModalOpen && (
                <SolutionSuccessModal
                    score={100} // Placeholder: Replace with actual score later
                    xpGained={15} // Placeholder: Replace with actual XP later
                    nextTaskName="Linked Lists" // Placeholder: Replace with next task details
                    nextTaskCategory="Data Structures" // Placeholder: Replace with next task details
                    onClose={() => setIsModalOpen(false)} // Closes the modal
                    onGoToStats={() => {
                        // Implement navigation to stats page
                        console.log('Navigate to stats');
                        setIsModalOpen(false);
                    }}
                    onGoToNextTask={() => {
                        // Implement navigation to next task
                        console.log('Navigate to next task');
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default TaskPage;