import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params;
    const { code, language } = await request.json();

    if (!code) {
        return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    try {
        // 1. Fetch test cases from DB
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { testCases: true }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const results = [];

        // 2. Run each test case
        for (let i = 0; i < task.testCases.length; i++) {
            const tc = task.testCases[i];
            const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sandbox-'));
            const ext = 'c'; // For now hardcoded to C
            const sourceFile = path.join(tmpDir, `source.${ext}`);
            const inputFile = path.join(tmpDir, 'input.txt');

            fs.writeFileSync(sourceFile, code);
            fs.writeFileSync(inputFile, tc.input);

            try {
                const { stdout, stderr } = await execPromise(
                    `docker run --rm --network none --memory 128m --cpus 0.5 -v "${tmpDir}:/workspace" code-runner c`,
                    { timeout: 5000 }
                );

                const actualOutput = stdout.trim();
                const expectedOutput = tc.expectedOutput.trim();
                const passed = actualOutput === expectedOutput;

                results.push({
                    testCaseId: tc.id,
                    testName: `Test ${i + 1}`,
                    passed,
                    // Security: Hide details for hidden tests
                    input: tc.isHidden ? 'Hidden' : tc.input,
                    expected: tc.isHidden ? 'Hidden' : expectedOutput,
                    actual: tc.isHidden ? (passed ? 'Hidden' : 'Incorrect output') : actualOutput,
                    error: stderr || null,
                    isHidden: tc.isHidden
                });
            } catch (error: any) {
                results.push({
                    testCaseId: tc.id,
                    testName: `Test ${i + 1}`,
                    passed: false,
                    input: tc.isHidden ? 'Hidden' : tc.input,
                    expected: tc.isHidden ? 'Hidden' : tc.expectedOutput,
                    actual: 'Error',
                    error: error.stderr || error.message,
                    isHidden: tc.isHidden
                });
            } finally {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        }

        return NextResponse.json({ results });

    } catch (error: any) {
        console.error('Run task error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
