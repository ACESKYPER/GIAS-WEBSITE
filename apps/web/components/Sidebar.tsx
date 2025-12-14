import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64">
      <div className="sticky top-24 p-4 border rounded bg-white">
        <div className="text-sm font-semibold mb-2">Standards</div>
        <ul className="space-y-2 text-sm">
          <li><Link href="/standards/GIAS-AIS-001" className="hover:underline">GIAS-AIS-001</Link></li>
          <li><Link href="/standards/GIAS-CAF-001" className="hover:underline">GIAS-CAF-001</Link></li>
          <li><Link href="/standards/GIAS-GOV-CHARTER" className="hover:underline">Governance Charter</Link></li>
          <li><Link href="/standards/GIAS-REGULATORY-CROSSWALK" className="hover:underline">Regulatory Crosswalk</Link></li>
          <li><Link href="/standards/GIAS-PUBLIC-STANDARDS-REGISTER" className="hover:underline">Public Standards Register</Link></li>
        </ul>
      </div>
    </aside>
  );
}
