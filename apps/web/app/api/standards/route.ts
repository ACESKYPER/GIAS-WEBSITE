import { NextResponse } from 'next/server';
import standards from '@/public/data/standards.json';

export async function GET() {
  try {
    // Return the standards data as JSON
    return NextResponse.json(standards, { status: 200 });
  } catch (error) {
    console.error('Error fetching standards:', error);
    return NextResponse.json({ error: 'Failed to fetch standards' }, { status: 500 });
  }
}