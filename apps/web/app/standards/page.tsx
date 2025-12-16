"use client";

import React from "react";

export default function StandardsPage() {
  const standards = [
    { id: "1", code: "GIAS-AIS-001", label: "AI Safety" },
    { id: "2", code: "GIAS-INT-002", label: "Interoperability" },
    { id: "3", code: "GIAS-GOV-CHARTER", label: "Governance Charter" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">
        GIAS maintains a limited set of AI interoperability and trust standards currently under institutional review.
      </h1>

      <div className="grid gap-4 mb-8">
        {standards.map((standard) => (
          <div
            key={standard.id}
            className="p-4 border border-slate-200 rounded hover:shadow-md transition"
          >
            <p className="text-lg font-semibold text-slate-900">
              {standard.code} — {standard.label}, scope restricted (institutional review draft)
            </p>
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