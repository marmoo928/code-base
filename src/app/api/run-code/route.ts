// app/api/run-code/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { code, language, stdin } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Create a temporary directory for this execution
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sandbox-'));

    // Determine file extension
    const ext = language === 'c' ? 'c' : 'js';
    const sourceFile = path.join(tmpDir, `source.${ext}`);
    const inputFile = path.join(tmpDir, 'input.txt');

    // Write source code
    fs.writeFileSync(sourceFile, code);

    // Write input file if provided
    if (stdin) {
      fs.writeFileSync(inputFile, stdin);
    }

    try {
      // Run the docker container
      // Mount the temp dir to /workspace
      // Read output from the command execution
      const { stdout, stderr } = await execPromise(
        `docker run --rm --network none --memory 128m --cpus 0.5 -v "${tmpDir}:/workspace" code-runner ${language}`,
        { timeout: 7000 } // Slightly longer than internal timeouts if any
      );

      return NextResponse.json({
        output: stdout,
        error: stderr, // This might include compilation errors or stderr output
      });
    } catch (error: any) {
      // If the process failed (exit code != 0), it usually means compilation error or runtime error
      // The stderr usually contains the relevant info in those cases
      return NextResponse.json({
        output: error.stdout || '',
        error: error.stderr || error.message,
      });
    } finally {
      // Cleanup: remove temporary directory
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp dir:', cleanupError);
      }
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}