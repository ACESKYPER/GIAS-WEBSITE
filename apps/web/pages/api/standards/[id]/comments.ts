import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'standards_comments.json');
if (!fs.existsSync(COMMENTS_FILE)) fs.writeFileSync(COMMENTS_FILE, JSON.stringify({}));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const data = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8')) || {};
  if (req.method === 'GET') {
    return res.json(data[id] || []);
  }
  if (req.method === 'POST') {
    const payload = req.body;
    const entry = {
      id: uuidv4(),
      name: payload.name || 'Anonymous',
      email: payload.email || null,
      comment: payload.comment || '',
      created_at: new Date().toISOString(),
    };
    data[id] = data[id] || [];
    data[id].push(entry);
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));
    return res.status(201).json(entry);
  }
  res.setHeader('Allow', 'GET,POST');
  res.status(405).end('Method Not Allowed');
}
