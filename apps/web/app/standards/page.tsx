"use client";

import React, { useEffect, useState } from "react";
import standardsData from "@/data/standards.json";

interface Standard {
  id: string;
  title: string;
  description: string;
  last_updated: string;
}

export default function StandardsPage() {
  const [standards, setStandards] = useState<Standard[]>([]);

  useEffect(() => {
    // Simulate fetching standards from an API or local JSON
    setStandards(standardsData);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">GIAS maintains a limited set of AI interoperability and trust standards currently under institutional review.</h1>

      <div className="grid gap-4 mb-8">
        {standards.map((standard) => (
          <div
            key={standard.id}
            className="p-4 border border-slate-200 rounded hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-slate-900">{standard.title}</h2>
            <p className="text-slate-600 text-sm">— Scope restricted (Institutional review draft)</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => window.location.href = "/access-request"}
          className="px-6 py-3 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition"
        >
          Request Institutional Access
        </button>
      </div>
    </div>
  );
}