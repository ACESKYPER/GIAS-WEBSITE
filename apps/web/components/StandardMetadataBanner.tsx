import React from "react";

type Meta = {
  id: string;
  version: string | number;
  status: string;
  issuing_body?: string;
  publication_date?: string;
};

export default function StandardMetadataBanner({ meta }: { meta: Meta }) {
  return (
    <div className="bg-white border rounded-md p-4 mb-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-xs text-gray-500">Document</div>
          <div className="text-2xl font-semibold tracking-tight">{meta.id}</div>
          <div className="text-sm text-gray-600">{meta.issuing_body}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Version</div>
          <div className="text-lg font-medium">{meta.version}</div>
          <div className={`mt-2 inline-block px-3 py-1 rounded text-sm ${meta.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {meta.status}
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-500">Published: {meta.publication_date}</div>
    </div>
  );
}
