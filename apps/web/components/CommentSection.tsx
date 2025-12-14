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
  const base = '';

  useEffect(() => {
    fetch(`/api/standards/${id}/comments`).then((r) => r.json()).then(setComments).catch(() => setComments([]));
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, email, comment: text };
    const res = await fetch(`/api/standards/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setName("");
      setEmail("");
      setText("");
      const updated = await fetch(`${base}/standards/${id}/comments`).then((r) => r.json());
      setComments(updated);
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold">Public comments</h3>
      <div className="mt-3 space-y-3">
        {comments.length === 0 ? <div className="text-sm text-gray-500">No comments yet.</div> : (
          <ul className="space-y-2">
            {comments.map((c) => (
              <li key={c.id} className="p-3 border rounded">
                <div className="text-sm text-gray-700"><strong>{c.name}</strong> <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</span></div>
                <div className="mt-1 text-sm text-gray-800">{c.comment}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full border p-2 rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="w-full border p-2 rounded" />
        <textarea required value={text} onChange={(e) => setText(e.target.value)} placeholder="Your comment" rows={4} className="w-full border p-2 rounded" />
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded">Submit comment</button>
        </div>
      </form>
    </div>
  );
}
