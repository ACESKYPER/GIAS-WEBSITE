import React from "react";

export default function DownloadButtons({ id }: { id: string }) {
  const jsonHref = `/api/standards/${id}/json`;
  const pdfHref = `/api/standards/${id}/pdf`;

  return (
    <div className="flex gap-3">
      <a href={jsonHref} className="px-3 py-2 border rounded text-sm bg-gray-50 hover:bg-gray-100">Download JSON</a>
      <a href={pdfHref} className="px-3 py-2 border rounded text-sm bg-gray-900 text-white hover:opacity-95">Download PDF</a>
    </div>
  );
}
