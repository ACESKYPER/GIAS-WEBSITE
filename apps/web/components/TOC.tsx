import React from 'react';

export default function TOC({ html }: { html: string }) {
  const regex = /<(h[1-3])(?: id="([^"]+)")?>(.*?)<\/\1>/g;
  const items: Array<{ level: number; id: string; text: string }> = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = regex.exec(html)) !== null) {
    const level = parseInt(m[1].substring(1));
    const id = m[2] || m[3].replace(/<[^>]+>/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const text = m[3].replace(/<[^>]+>/g, '');
    items.push({ level, id, text });
  }

  if (items.length === 0) return null;

  return (
    <nav className="prose-sm sticky top-24">
      <div className="text-sm font-medium mb-2">Contents</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} style={{ marginLeft: (it.level - 1) * 12 }}>
            <a href={`#${it.id}`} className="text-sm text-blue-700 hover:underline">{it.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
