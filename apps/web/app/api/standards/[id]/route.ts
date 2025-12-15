import { NextResponse } from 'next/server';
import standards from '@/public/data/standards.json';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const standard = standards.find((item) => item.id === id);

    if (!standard) {
      return NextResponse.json({ error: 'Standard not found' }, { status: 404 });
    }

    return NextResponse.json(standard, { status: 200 });
  } catch (error) {
    console.error('Error fetching standard:', error);
    return NextResponse.json({ error: 'Failed to fetch standard' }, { status: 500 });
  }
}