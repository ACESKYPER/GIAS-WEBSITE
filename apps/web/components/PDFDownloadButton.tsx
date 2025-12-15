import React from 'react';

export default function PDFDownloadButton() {
  return (
    <button
      className="px-3 py-2 bg-gray-900 text-white rounded text-sm"
      aria-label="Download PDF"
      disabled
    >
      PDF Download Unavailable
    </button>
  );
}
