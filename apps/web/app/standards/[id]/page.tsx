"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CommentSection from "@/components/CommentSection";

interface Standard {
  id: string;
  title: string;
  description: string;
  last_updated: string;
}

export default function StandardDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [standard, setStandard] = useState<Standard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStandard = async () => {
      try {
        const response = await fetch(`/api/standards/${id}`);
        if (!response.ok) throw new Error("Failed to fetch standard.");
        const data = await response.json();
        setStandard(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandard();
  }, [id]);

  if (loading) return <p className="text-center">Loading standard...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!standard) return <p className="text-center">Standard not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{standard.title}</h1>
      <p className="text-gray-600 mb-4">{standard.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        Last updated: {new Date(standard.last_updated).toLocaleDateString()}
      </p>

      <div className="flex gap-4 mb-6">
        <a
          href={`/api/standards/${id}/download?format=json`}
          className="px-4 py-2 bg-gray-50 border rounded hover:bg-gray-100"
        >
          Download JSON
        </a>
        <a
          href={`/api/standards/${id}/download?format=pdf`}
          className="px-4 py-2 bg-gray-900 text-white rounded hover:opacity-90"
        >
          Download PDF
        </a>
      </div>

      <CommentSection id={id as string} />
    </div>
  );
}