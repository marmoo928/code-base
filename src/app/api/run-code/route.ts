// app/api/run-code/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    const JDOODLE_CLIENT_ID = process.env.NEXT_PUBLIC_JDOODLE_CLIENT_ID;
    const JDOODLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_JDOODLE_CLIENT_SECRET;

    if (!JDOODLE_CLIENT_ID || !JDOODLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'JDoodle credentials not configured' },
        { status: 500 }
      );
    }

    // Call JDoodle API from server-side (no CORS issues)
    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
        script: code,
        language: 'c',
        versionIndex: '4',
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}