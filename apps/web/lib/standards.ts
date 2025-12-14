import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const STANDARDS_DIR = path.join(process.cwd(), '..', '..', '..', 'standards');

export type StandardMeta = {
  id: string;
  version?: string;
  status?: string;
  issuing_body?: string;
  publication_date?: string;
};

export function listStandards(): StandardMeta[] {
  const files = fs.existsSync(STANDARDS_DIR) ? fs.readdirSync(STANDARDS_DIR).filter((f) => f.endsWith('.md')) : [];
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(STANDARDS_DIR, f), 'utf8');
    const m = matter(raw);
    return {
      id: m.data.id || f.replace('.md', ''),
      version: m.data.version,
      status: m.data.status,
      issuing_body: m.data.issuing_body,
      publication_date: m.data.publication_date,
    } as StandardMeta;
  });
}

export async function getStandard(slug: string) {
  const p = path.join(STANDARDS_DIR, `${slug}.md`);
  if (!fs.existsSync(p)) throw new Error('Not found');
  const raw = fs.readFileSync(p, 'utf8');
  const m = matter(raw);
  const processed = await remark().use(html).process(m.content);
  let htmlStr = processed.toString();
  // ensure headings have ids
  htmlStr = htmlStr.replace(/<(h[1-3])>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return { meta: m.data, content: htmlStr };
}

export function getStandardJSON(slug: string) {
  const p = path.join(STANDARDS_DIR, `${slug}.md`);
  if (!fs.existsSync(p)) throw new Error('Not found');
  const raw = fs.readFileSync(p, 'utf8');
  const m = matter(raw);
  return { id: slug, meta: m.data, content: m.content };
}
