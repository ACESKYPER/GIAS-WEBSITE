"use client";

import React, { useEffect, useState } from "react";
import CommentSection from "@/components/CommentSection";
import DownloadButtons from "@/components/DownloadButtons";

export default function StandardsPage() {
  const [standards, setStandards] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch("/data/standards.json");
        if (!response.ok) throw new Error("Failed to fetch standards.");
        const data = await response.json();
        setStandards(data);
      } catch (error) {
        console.error(error);
        setStandards([]);
      }
    };

    fetchStandards();
  }, []);

  const filteredStandards = standards.filter((standard) =>
    standard.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-4">GIAS Standards</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search standards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Standards List */}
      {filteredStandards.length === 0 ? (
        <p className="text-gray-500">No standards available.</p>
      ) : (
        <div className="space-y-4">
          {filteredStandards.map((standard) => (
            <div
              key={standard.id}
              className="p-4 border rounded shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-1">{standard.title}</h2>
              <p className="text-gray-600 mb-2">{standard.description}</p>
              <p className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date(standard.last_updated).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Comment Section */}
      <CommentSection id="gias-standards" />

      {/* Download Buttons */}
      <DownloadButtons id="gias-standards" />
    </div>
  );
}