import React from 'react';

export default function TOC({ headings }: { headings: Array<{ level: number; id: string; text: string }> }) {
  if (!headings || headings.length === 0) return null;
  return (
    <nav className="prose-sm sticky top-24">
      <div className="text-sm font-medium mb-2">Contents</div>
      <ul className="space-y-1">
        {headings.map((it) => (
          <li key={it.id} style={{ marginLeft: (it.level - 1) * 12 }}>
            <a href={`#${it.id}`} className="text-sm text-blue-700 hover:underline">{it.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
