"use client";
import React, { useState } from "react";

export default function DownloadButtons({ id }: { id: string }) {
  const [loadingJson, setLoadingJson] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const downloadFile = async (type: "json" | "pdf") => {
    try {
      const setLoading = type === "json" ? setLoadingJson : setLoadingPdf;
      setLoading(true);

      const res = await fetch(`/api/standards/${id}/${type}`);
      if (!res.ok) throw new Error(`Failed to fetch ${type}`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(`Error downloading ${type}: ${err}`);
    } finally {
      type === "json" ? setLoadingJson(false) : setLoadingPdf(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => downloadFile("json")}
        disabled={loadingJson}
        className="px-3 py-2 border rounded text-sm bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
      >
        {loadingJson ? "Downloading..." : "Download JSON"}
      </button>
      <button
        onClick={() => downloadFile("pdf")}
        disabled={loadingPdf}
        className="px-3 py-2 border rounded text-sm bg-gray-900 text-white hover:opacity-95 disabled:opacity-50"
      >
        {loadingPdf ? "Downloading..." : "Download PDF"}
      </button>
    </div>
  );
}
