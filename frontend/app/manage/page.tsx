'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4080';

type Author = { id: string; name: string; email: string | null; isActive: boolean; _count?: { items: number } };
type Feed = { id: string; title: string; slug: string; description: string | null; _count?: { items: number } };
type Item = {
  id: string;
  title: string;
  summary: string | null;
  isActive: boolean;
  author: { name: string } | null;
  feed?: { title: string };
};

export default function ManagePage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const [feedTitle, setFeedTitle] = useState('');
  const [feedDesc, setFeedDesc] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  const [itemFeed, setItemFeed] = useState('');
  const [itemAuthor, setItemAuthor] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemSummary, setItemSummary] = useState('');
  const [itemLink, setItemLink] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemCategory, setItemCategory] = useState('');

  const [itemContent, setItemContent] = useState('');

  const loadAll = async () => {
    try {
      const [f, a, i] = await Promise.all([
        fetch(`${API_URL}/api/feeds`).then((r) => r.json()),
        fetch(`${API_URL}/api/authors`).then((r) => r.json()),
        fetch(`${API_URL}/api/items`).then((r) => r.json()),
      ]);
      setFeeds(f);
      setAuthors(a);
      setItems(i);
    } catch {
      setMsg({ text: 'Could not reach the RSS Server', ok: false });
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const send = async (url: string, options: RequestInit, okText: string) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMsg({ text: body.error ?? `Request failed (${res.status})`, ok: false });
        return false;
      }
      setMsg({ text: okText, ok: true });
      await loadAll();
      return true;
    } catch {
      setMsg({ text: 'Could not reach the RSS Server', ok: false });
      return false;
    }
  };

  const addFeed = async () => {
    if (!feedTitle.trim()) return;
    const ok = await send(
      `${API_URL}/api/feeds`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: feedTitle, description: feedDesc || null }),
      },
      `Feed "${feedTitle}" created`
    );
    if (ok) {
      setFeedTitle('');
      setFeedDesc('');
    }
  };

  const addAuthor = async () => {
    if (!authorName.trim()) return;
    const ok = await send(
      `${API_URL}/api/authors`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: authorName, email: authorEmail || null }),
      },
      `Author "${authorName}" created`
    );
    if (ok) {
      setAuthorName('');
      setAuthorEmail('');
    }
  };

  const addItem = async () => {
    if (!itemFeed || !itemTitle.trim()) {
      setMsg({ text: 'A feed and a title are required', ok: false });
      return;
    }
    const ok = await send(
      `${API_URL}/api/items`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedId: itemFeed,
          authorId: itemAuthor || null,
          title: itemTitle,
          summary: itemSummary || null,
          content: itemContent || null,
          link: itemLink || null,
          imageUrl: itemImage || null,
          category: itemCategory || null,
        }),
      },
      `Item "${itemTitle}" published`
    );
    if (ok) {
      setItemTitle('');
      setItemSummary('');
      setItemLink('');
      setItemImage('');
      setItemCategory('');
      setItemContent('');
    }
  };

  const box = 'w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-slate-700 dark:border-slate-600';
  const btn = 'px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-slate-900 font-medium';
  const card = 'rounded-lg border border-slate-200 dark:border-slate-600 p-5 mb-8';

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Manage content</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Create and remove feeds, authors and items on the RSS Server.
      </p>

      {msg && (
        <div
          role="status"
          className={`mb-6 rounded border p-3 ${
            msg.ok
              ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
              : 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      <section className={card}>
        <h3 className="text-xl font-semibold mb-3">Feeds</h3>
        <input className={box} placeholder="Feed title" value={feedTitle} onChange={(e) => setFeedTitle(e.target.value)} />
        <input className={box} placeholder="Description (optional)" value={feedDesc} onChange={(e) => setFeedDesc(e.target.value)} />
        <button className={btn} onClick={addFeed}>Add feed</button>

        <ul className="mt-4 space-y-2">
          {feeds.map((f) => (
            <li key={f.id} className="flex justify-between items-center text-sm border-t pt-2 dark:border-slate-600">
              <span>{f.title} <span className="text-slate-500">({f._count?.items ?? 0} items)</span></span>
              <button
                className="text-red-600 dark:text-red-400 hover:underline"
                onClick={() =>
                  send(`${API_URL}/api/feeds?id=${f.id}`, { method: 'DELETE' }, `Feed "${f.title}" deleted`)
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h3 className="text-xl font-semibold mb-3">Authors</h3>
        <input className={box} placeholder="Author name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        <input className={box} placeholder="Email (optional)" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />
        <button className={btn} onClick={addAuthor}>Add author</button>

        <ul className="mt-4 space-y-2">
          {authors.map((a) => (
            <li key={a.id} className="flex justify-between items-center text-sm border-t pt-2 dark:border-slate-600">
              <span>
                {a.name} <span className="text-slate-500">({a._count?.items ?? 0} items)</span>
                {!a.isActive && <span className="ml-2 text-amber-600 dark:text-amber-400 dark:text-amber-400">inactive</span>}
              </span>
              <span className="space-x-3">
                <button
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                  onClick={() =>
                    send(
                      `${API_URL}/api/authors?id=${a.id}`,
                      {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isActive: !a.isActive }),
                      },
                      `${a.name} ${a.isActive ? 'deactivated' : 'reactivated'}`
                    )
                  }
                >
                  {a.isActive ? 'Deactivate' : 'Reactivate'}
                </button>
                <button
                    className="text-red-600 dark:text-red-400 hover:underline"                  onClick={() =>
                    send(`${API_URL}/api/authors?id=${a.id}`, { method: 'DELETE' }, `Author "${a.name}" deleted`)
                  }
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h3 className="text-xl font-semibold mb-3">Items</h3>

        <label className="block text-sm mb-1">Feed (required)</label>
        <select className={box} value={itemFeed} onChange={(e) => setItemFeed(e.target.value)}>
          <option value="">Select a feed…</option>
          {feeds.map((f) => (
            <option key={f.id} value={f.id}>{f.title}</option>
          ))}
        </select>

        <label className="block text-sm mb-1">Author (optional)</label>
        <select className={box} value={itemAuthor} onChange={(e) => setItemAuthor(e.target.value)}>
          <option value="">No author</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <input className={box} placeholder="Item title" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} />
        <textarea className={box} placeholder="Summary" value={itemSummary} onChange={(e) => setItemSummary(e.target.value)} />
        <textarea
          className={box}
          rows={6}
          placeholder="Full content (optional — shown on the item page)"
          value={itemContent}
          onChange={(e) => setItemContent(e.target.value)}
        />
        <input className={box} placeholder="Link (optional)" value={itemLink} onChange={(e) => setItemLink(e.target.value)} />
        <input className={box} placeholder="Image URL (optional)" value={itemImage} onChange={(e) => setItemImage(e.target.value)} />
        <input className={box} placeholder="Category (optional)" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} />
        <button className={btn} onClick={addItem}>Publish item</button>

        <ul className="mt-4 space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between items-center text-sm border-t pt-2 dark:border-slate-600">
              <span>{i.title} <span className="text-slate-500">— {i.author?.name ?? 'no author'}</span></span>
              <button
                className="text-red-600 dark:text-red-400 hover:underline"
                onClick={() =>
                  send(`${API_URL}/api/items?id=${i.id}`, { method: 'DELETE' }, `Item "${i.title}" withdrawn`)
                }
              >
                Withdraw
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}