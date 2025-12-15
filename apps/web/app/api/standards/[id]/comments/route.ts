import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for comments
const commentsStore: Record<string, { id: string; name: string; email: string; comment: string; created_at: string }[]> = {};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Return comments for the given standard ID or an empty array if none exist
  const comments = commentsStore[id] || [];
  return NextResponse.json(comments, { status: 200 });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { name, email, comment } = body;

    if (!name || !email || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newComment = {
      id: uuidv4(),
      name,
      email,
      comment,
      created_at: new Date().toISOString(),
    };

    // Add the comment to the in-memory store
    if (!commentsStore[id]) {
      commentsStore[id] = [];
    }
    commentsStore[id].push(newComment);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}