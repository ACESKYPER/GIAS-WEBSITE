import React from 'react';

export default function PDFDownloadButton({ id }: { id: string }) {
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const href = `${base}/standards/${id}/pdf`;
  return (
    <a href={href} className="px-3 py-2 bg-gray-900 text-white rounded text-sm">Download PDF</a>
  );
}
