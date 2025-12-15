"use client";
import React, { useEffect, useState } from "react";

type Comment = {
  id: string;
  name: string;
  email?: string;
  comment: string;
  created_at: string;
};

export default function CommentSection({ id }: { id: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments from API
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/standards/${id}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data: Comment[] = await res.json();
      setComments(data || []);
    } catch (err: any) {
      setComments([]);
      setError(err.message || "Error loading comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // Submit new comment
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/standards/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, comment: text }),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      const newComment = await response.json();
      setComments((prev) => [newComment, ...prev]);
      setName("");
      setEmail("");
      setText("");
    } catch (err: any) {
      setError(err.message || "Error submitting comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      <form onSubmit={submitComment} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Comment"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="p-4 border rounded">
            <p className="font-semibold">{comment.name}</p>
            <p className="text-gray-600">{comment.comment}</p>
            <p className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
