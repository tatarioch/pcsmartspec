"use client";

import { useMemo, useState } from "react";

type StorageItem = {
  Model: string;
  Size_GB: number;
  Type: string;
  BusType: string;
};

type PcSpec = {
  Brand: string;
  Model: string;
  CPU: string;
  Cores: string;
  Threads: string;
  BaseSpeed_MHz: string;
  RAM_GB: string;
  RAM_Speed_MHz: string;
  RAM_Type: string;
  Storage: StorageItem[];
  GPU: string;
  Display_Resolution: string;
  Screen_Size_inch: number;
  OS: string;
  Scan_Time: string;
};

const sampleSpec: PcSpec = {
  Brand: "HP",
  Model: "Victus by HP Gaming Laptop 15-fa1xxx",
  CPU: "13th Gen Intel(R) Core(TM) i5-13420H",
  Cores: "8",
  Threads: "12",
  BaseSpeed_MHz: "2100",
  RAM_GB: "16",
  RAM_Speed_MHz: "3200",
  RAM_Type: "DDR4",
  Storage: [
    {
      Model: "PSENN512GA87FC0",
      Size_GB: 512.11,
      Type: "SSD",
      BusType: "NVMe",
    },
  ],
  GPU: "Intel(R) UHD Graphics, NVIDIA GeForce RTX 2050",
  Display_Resolution: "1920x1080",
  Screen_Size_inch: 15.6,
  OS: "Microsoft Windows 11 Home",
  Scan_Time: "2025-11-01T13:53:16.784566",
};

export default function AdminDashboard() {
  const [images, setImages] = useState<string[]>([]);
  const [guaranteeMonths, setGuaranteeMonths] = useState<number>(12);
  const [guaranteeProvider, setGuaranteeProvider] =
    useState<string>("PCSmartSpec");
  const [publishReady, setPublishReady] = useState<boolean>(false);

  const [listPrice, setListPrice] = useState<number>(799);
  const [discountPct, setDiscountPct] = useState<number>(0);
  const [stock, setStock] = useState<number>(5);

  const totalStorageGB = useMemo(
    () => sampleSpec.Storage.reduce((sum, s) => sum + s.Size_GB, 0),
    []
  );
  const ramSummary = useMemo(
    () => `${sampleSpec.RAM_GB}GB ${sampleSpec.RAM_Type} ${sampleSpec.RAM_Speed_MHz}MHz`,
    []
  );
  const storageKinds = useMemo(() => {
    const kinds = Array.from(
      new Set(
        (sampleSpec.Storage || []).map((s) =>
          [s.Type, s.BusType].filter(Boolean).join(" ")
        )
      )
    );
    return kinds.join(", ");
  }, []);

  const mockSold = useMemo(
    () => [
      {
        id: "ORD-1001",
        model: sampleSpec.Model,
        price: 799,
        buyer: "A. Bekele",
        date: "2025-10-12",
      },
      {
        id: "ORD-1002",
        model: sampleSpec.Model,
        price: 789,
        buyer: "M. Yusuf",
        date: "2025-10-24",
      },
      {
        id: "ORD-1003",
        model: "HP 255 G8",
        price: 550,
        buyer: "S. Hailu",
        date: "2025-11-01",
      },
    ],
    []
  );

  function onSelectImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        setImages((prev) => [...prev, String(reader.result)]);
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
              PS
            </div>
            <div>
              <h1 className="text-lg font-semibold">PCSmartSpec Admin</h1>
              <p className="text-xs text-zinc-500">
                Manage specs, media, guarantee, analytics, and sales
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a
              href="/"
              className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
            >
              Home
            </a>
            <button
              onClick={() => setPublishReady((v) => !v)}
              className={`rounded-md px-3 py-2 text-sm font-medium text-white ${
                publishReady ? "bg-emerald-600" : "bg-zinc-900"
              }`}
            >
              {publishReady ? "Ready to Publish" : "Mark as Ready"}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Active Listings</div>
            <div className="text-2xl font-semibold">42</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Views (7d)</div>
            <div className="text-2xl font-semibold">1,284</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Saves (7d)</div>
            <div className="text-2xl font-semibold">312</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Conversion</div>
            <div className="text-2xl font-semibold">3.1%</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Revenue (MTD)</div>
            <div className="text-2xl font-semibold">$25,430</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Orders (MTD)</div>
            <div className="text-2xl font-semibold">64</div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Seller Panel</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Quick Actions</div>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-md border px-3 py-2 text-sm">Duplicate Listing</button>
                    <button className="rounded-md border px-3 py-2 text-sm">Share</button>
                    <button className="rounded-md border px-3 py-2 text-sm">Feature Listing</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Pricing</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs text-zinc-500">List Price (USD)</label>
                      <input
                        type="number"
                        min={0}
                        value={listPrice}
                        onChange={(e) => setListPrice(Number(e.target.value))}
                        className="w-full rounded-md border p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-500">Discount %</label>
                      <input
                        type="number"
                        value={discountPct}
                        onChange={(e) => setDiscountPct(Number(e.target.value))}
                        className="w-full rounded-md border p-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-zinc-600">Final Price</div>
                    <div className="font-semibold">${Math.max(0, Math.round(listPrice * (1 - discountPct / 100)))}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDiscountPct((v) => v - 5)} className="rounded-md border px-3 py-2 text-sm">-5%</button>
                    <button onClick={() => setDiscountPct((v) => v + 5)} className="rounded-md border px-3 py-2 text-sm">+5%</button>
                    <button onClick={() => setDiscountPct(0)} className="rounded-md border px-3 py-2 text-sm">Reset</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Promotions</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <label className="flex items-center gap-2"><input type="checkbox" /> Homepage Feature</label>
                    <label className="flex items-center gap-2"><input type="checkbox" /> Highlight Badge</label>
                    <label className="flex items-center gap-2"><input type="checkbox" /> Bundle Discount</label>
                    <label className="flex items-center gap-2"><input type="checkbox" /> Free Delivery</label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Inventory</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-500">In Stock</label>
                      <input
                        type="number"
                        min={0}
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full rounded-md border p-2 text-sm"
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <div className={`w-full rounded-md border p-2 text-center text-sm ${stock > 3 ? "bg-emerald-50 text-emerald-700" : stock > 0 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
                        {stock > 3 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            

            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Guarantee</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
                    Provider
                  </label>
                  <input
                    value={guaranteeProvider}
                    onChange={(e) => setGuaranteeProvider(e.target.value)}
                    className="w-full rounded-md border p-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={guaranteeMonths}
                    onChange={(e) => setGuaranteeMonths(Number(e.target.value))}
                    className="w-full rounded-md border p-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    disabled={!publishReady}
                  >
                    Save Guarantee
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                This is a UI-only mock. No backend calls are made.
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Analytics</h2>
              <div className="space-y-3">
                <Bar label="Views" value={72} total={100} color="bg-blue-600" />
                <Bar
                  label="Saves"
                  value={38}
                  total={100}
                  color="bg-emerald-600"
                />
                <Bar
                  label="Share"
                  value={22}
                  total={100}
                  color="bg-violet-600"
                />
                <Bar label="CTR" value={14} total={100} color="bg-amber-600" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <StatCard title="Conversion" value="3.2%" />
                <StatCard title="Avg. Price" value="$792" />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Sold PCs</h2>
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 text-zinc-600">
                    <tr>
                      <th className="px-3 py-2">Order</th>
                      <th className="px-3 py-2">Model</th>
                      <th className="px-3 py-2">Buyer</th>
                      <th className="px-3 py-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSold.map((row) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-3 py-2">{row.id}</td>
                        <td className="px-3 py-2">{row.model}</td>
                        <td className="px-3 py-2">{row.buyer}</td>
                        <td className="px-3 py-2 text-right">${row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other Shops removed - seller-focused UI only */}
          </aside>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button className="rounded-md border px-4 py-2 text-sm font-medium">
            Save Draft
          </button>
          <button
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            disabled={!publishReady}
          >
            Publish Listing
          </button>
        </div>
      </main>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="truncate text-sm font-medium" title={value}>
        {value}
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / total) * 100)));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-100">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function formatScanTime(dateStr: string) {
  const d = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mi = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${dd}/${mm}/${yyyy}, ${hh}:${mi}:${ss} UTC`;
}
