import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const p = path.join(process.cwd(), '..', '..', '..', 'standards', `${id}.md`);
  if (!fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
  const raw = fs.readFileSync(p, 'utf8');
  const m = matter(raw);
  return res.json({ id, meta: m.data, content: m.content });
}
