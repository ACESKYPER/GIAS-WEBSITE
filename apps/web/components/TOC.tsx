import React from 'react';

export default function TOC({ headings }: { headings: Array<{ level: number; id: string; text: string }> }) {
  if (!headings || headings.length === 0) return null;
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav aria-label="Table of contents" className="prose-sm sticky top-24">
      <div className="text-sm font-medium mb-2">Contents</div>
      <ul className="space-y-1">
        {headings.map((it) => (
          <li key={it.id} style={{ marginLeft: (it.level - 1) * 12 }}>
            <a href={`#${it.id}`} onClick={(e) => handleClick(e, it.id)} className="text-sm text-blue-700 hover:underline">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
