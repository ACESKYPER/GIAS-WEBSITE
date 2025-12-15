import React from 'react';

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64">
      <div className="sticky top-24 p-4 border rounded bg-white">
        <div className="text-sm font-semibold mb-2">Navigation</div>
        <ul className="space-y-2 text-sm">
          {/* Add other navigation links here */}
        </ul>
      </div>
    </aside>
  );
}
