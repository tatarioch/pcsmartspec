"use client";

export default function SoldPage() {
  const rows = [
    { id: "ORD-2101", model: "Victus 15-fa1xxx", buyer: "A. Bekele", date: "2025-10-12", price: 799 },
    { id: "ORD-2102", model: "HP 255 G8", buyer: "M. Yusuf", date: "2025-10-24", price: 550 },
    { id: "ORD-2103", model: "Lenovo IdeaPad 3", buyer: "S. Hailu", date: "2025-11-01", price: 620 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">Sales</h1>
            <p className="text-xs text-zinc-500">Completed orders</p>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/admin" className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Dashboard</a>
            <a href="/admin/sold" className="rounded-md px-3 py-2 text-sm bg-zinc-900 text-white">Sold</a>
            <a href="/admin/analytics" className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Analytics</a>
            <a href="/admin/attach" className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Attach</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Orders</h2>
            <div className="text-sm text-zinc-500">{rows.length} results</div>
          </div>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Model</th>
                  <th className="px-3 py-2">Buyer</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2">{r.model}</td>
                    <td className="px-3 py-2">{r.buyer}</td>
                    <td className="px-3 py-2">{r.date}</td>
                    <td className="px-3 py-2 text-right">${r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
