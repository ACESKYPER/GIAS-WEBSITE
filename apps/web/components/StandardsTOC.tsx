import React from "react";

export default function StandardsTOC({ html }: { html: string }) {
  // Extract headings with ids from HTML
  const headingRegex = /<(h[1-3]) id="([^"]+)">([^<]+)<\/h[1-3]>/g;
  const items: Array<{ level: number; id: string; text: string }> = [];
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = headingRegex.exec(html)) !== null) {
    items.push({ level: parseInt(match[1].substring(1)), id: match[2], text: match[3] });
  }

  if (items.length === 0) return null;

  return (
    <nav className="prose-sm sticky top-24"> 
      <div className="text-sm font-medium mb-2">Contents</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} style={{ marginLeft: (it.level - 1) * 12 }}>
            <a href={`#${it.id}`} className="text-sm text-blue-700 hover:underline">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
