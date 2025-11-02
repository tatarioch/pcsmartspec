"use client";

import { useEffect, useMemo, useState } from "react";

type StorageItem = { Model: string; Size_GB: number; Type: string; BusType: string };

type Listing = {
  id: string;
  Brand: string;
  Model: string;
  CPU: string;
  RAM_GB: string;
  RAM_Type: string;
  RAM_Speed_MHz: string;
  Storage: StorageItem[];
  GPU: string;
  Display_Resolution: string;
  Screen_Size_inch: number;
  OS: string;
  price: number;
  description: string;
  images: string[];
  imageUrl: string | null;
  createdAt: string;
  status: string;
};

function prettyStorage(items: StorageItem[]) {
  if (!items?.length) return "—";
  const kinds = Array.from(new Set(items.map(s => [s.Type, s.BusType].filter(Boolean).join(" ")))).filter(Boolean).join(", ");
  const total = items.reduce((sum, s) => sum + (Number(s.Size_GB) || 0), 0);
  return `${Math.round(total)} GB${kinds ? ` · ${kinds}` : ""}`;
}

export default function BuyerPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const t = Date.now();
        const res = await fetch(`/api/listings?t=${t}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load listings: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setListings(data.data || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter(l =>
      [l.Brand, l.Model, l.CPU, l.GPU, l.OS].some(v => (v || "").toLowerCase().includes(q))
    );
  }, [query, listings]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Available PCs</h1>
          <p className="text-sm text-zinc-500">Browse published listings and request to buy</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search brand, model, CPU, GPU, OS"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 rounded-md border p-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-white p-4">
              <div className="h-4 w-1/2 rounded bg-zinc-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100" />
              <div className="mt-4 h-10 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <a 
              key={l.id} 
              href={`/listings/${l.id}`}
              className="block rounded-xl border bg-white p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-xs text-zinc-500">{l.Brand}</div>
              <div className="text-lg font-semibold">{l.Model}</div>
              {l.imageUrl && (
                <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
                  <img
                    src={l.images?.[0]}
                    alt={`${l.Brand} ${l.Model}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-laptop.jpg'; // Fallback image
                    }}
                  />
                </div>
              )}
              <div className="mt-2 text-sm text-zinc-500">
                <div className="font-medium text-lg text-gray-900 mb-2">
                  {l.Brand} {l.Model}
                </div>
                <div className="text-blue-600 font-semibold text-lg mb-2">
                  ${l.price?.toLocaleString()}
                </div>
                <div className="line-clamp-2 text-gray-700 mb-2">
                  {l.description}
                </div>
                <div className="text-sm">
                  <div>{l.CPU}</div>
                  <div>{l.RAM_GB}GB {l.RAM_Type} RAM</div>
                  <div>{prettyStorage(l.Storage)}</div>
                  <div>{l.GPU}</div>
                  <div>{l.Screen_Size_inch}" {l.Display_Resolution}</div>
                  <div>{l.OS}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                  onClick={() => alert(`Request to buy submitted for ${l.Brand} ${l.Model} (ID: ${l.id})`)}
                >
                  Request to Buy
                </button>
                <button
                  className="rounded-md border px-3 py-2 text-sm"
                  onClick={() => alert(JSON.stringify(l, null, 2))}
                >
                  View Details
                </button>
              </div>
            </a>
          ))}
          {!filtered.length && (
            <div className="col-span-full rounded-md border bg-white p-6 text-center text-sm text-zinc-600">
              No published listings yet. Please check back later.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
