import React from 'react';

export default function PDFDownloadButton({ id }: { id: string }) {
  // Prefer a configured public API URL, otherwise use the internal API route
  const apiBase = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/g, '') : '';
  const href = apiBase ? `${apiBase}/api/standards/${id}/pdf` : `/api/standards/${id}/pdf`;
  return <a href={href} className="px-3 py-2 bg-gray-900 text-white rounded text-sm">Download PDF</a>;
}
