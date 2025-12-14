import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const p = path.join(process.cwd(), 'public', 'pdfs', `${id}.pdf`);
  if (!fs.existsSync(p)) return res.status(404).json({ error: 'PDF not found' });
  res.setHeader('Content-Type', 'application/pdf');
  const stream = fs.createReadStream(p);
  stream.pipe(res);
}
