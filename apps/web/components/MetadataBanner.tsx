import React from 'react';

export default function MetadataBanner() {
  return (
    <section aria-labelledby="metadata-banner" className="bg-white border rounded-md p-4 mb-6 shadow-sm">
      <h2 id="metadata-banner" className="sr-only">Metadata</h2>
      <div className="text-sm text-gray-500">No metadata available.</div>
    </section>
  );
}
