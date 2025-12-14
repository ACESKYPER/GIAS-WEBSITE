import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STANDARDS_DIR = path.join(process.cwd(), 'standards');

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

export function getAllStandards() {
  const files = fs.existsSync(STANDARDS_DIR) ? fs.readdirSync(STANDARDS_DIR).filter((f) => f.endsWith('.md')) : [];
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(STANDARDS_DIR, f), 'utf8');
    const m = matter(raw);
    // title can be in frontmatter or derived from id
    const title = m.data.title || m.data.id || f.replace('.md', '');
    const slug = f.replace('.md', '');
    const metadata = {
      id: m.data.id || slug,
      version: m.data.version,
      status: m.data.status,
      issuing_body: m.data.issuing_body,
      publication_date: m.data.publication_date,
      description: m.data.description,
    };
    return { slug, title, metadata };
  });
}

export async function getStandardBySlug(slug: string) {
  const s = await getStandard(slug);
  return { content: s.content, metadata: s.meta, headings: s.headings };
}

export async function getStandard(slug: string) {
  const p = path.join(STANDARDS_DIR, `${slug}.md`);
  if (!fs.existsSync(p)) throw new Error('Not found');
  const raw = fs.readFileSync(p, 'utf8');
  const m = matter(raw);
  const markdown = m.content;
  // extract headings up to level 3 for TOC
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const slugify = (t: string) =>
    t
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const regex = /^(#{1,3})\s+(.*)$/gm;
  let m2;
  // eslint-disable-next-line no-cond-assign
  while ((m2 = regex.exec(markdown)) !== null) {
    const level = m2[1].length;
    const text = m2[2].trim();
    const id = slugify(text.replace(/<[^>]+>/g, ''));
    headings.push({ level, text, id });
  }
  return { meta: m.data, content: markdown, headings };
}

export function getStandardJSON(slug: string) {
  const p = path.join(STANDARDS_DIR, `${slug}.md`);
  if (!fs.existsSync(p)) throw new Error('Not found');
  const raw = fs.readFileSync(p, 'utf8');
  const m = matter(raw);
  return { id: slug, meta: m.data, content: m.content };
}
