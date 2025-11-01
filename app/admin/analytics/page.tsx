"use client";

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / total) * 100)));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-zinc-500">Engagement and performance</p>
      </div>
      <main className="py-4">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Stat title="Views (7d)" value="1,284" />
          <Stat title="Saves (7d)" value="312" />
          <Stat title="Share (7d)" value="178" />
          <Stat title="CTR" value="3.2%" />
          <Stat title="Avg. Price" value="$792" />
          <Stat title="Bounce" value="41%" />
        </section>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border bg-white p-5">
                <h2 className="mb-4 text-base font-semibold">Engagement</h2>
                <div className="space-y-3">
                  <Bar label="Views" value={72} total={100} color="bg-blue-600" />
                  <Bar label="Saves" value={38} total={100} color="bg-emerald-600" />
                  <Bar label="Share" value={22} total={100} color="bg-violet-600" />
                  <Bar label="CTR" value={14} total={100} color="bg-amber-600" />
                </div>
              </div>

              <div className="rounded-xl border bg-white p-5">
                <h2 className="mb-4 text-base font-semibold">Top Listings</h2>
                <ul className="divide-y rounded-md border bg-zinc-50">
                  {["Victus 15-fa1xxx","IdeaPad 3","HP 255 G8"].map((n,i)=>(
                    <li key={i} className="grid grid-cols-3 gap-2 p-3 text-sm">
                      <div className="col-span-2 truncate">{n}</div>
                      <div className="text-right text-zinc-600">Views {i===0?"534":i===1?"388":"362"}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          <aside className="space-y-6">
            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Channels</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between"><span>Organic</span><span className="font-medium">58%</span></li>
                <li className="flex items-center justify-between"><span>Direct</span><span className="font-medium">22%</span></li>
                <li className="flex items-center justify-between"><span>Referral</span><span className="font-medium">14%</span></li>
                <li className="flex items-center justify-between"><span>Ads</span><span className="font-medium">6%</span></li>
              </ul>
            </div>
            
            {/* Recent Orders Section */}
            <div className="mt-6 rounded-xl border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Recent Orders</h2>
                <div className="text-sm text-zinc-500">3 results</div>
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
                    {[
                      { id: "ORD-2101", model: "Victus 15-fa1xxx", buyer: "A. Bekele", date: "2025-10-12", price: 799 },
                      { id: "ORD-2102", model: "HP 255 G8", buyer: "M. Yusuf", date: "2025-10-24", price: 550 },
                      { id: "ORD-2103", model: "Lenovo IdeaPad 3", buyer: "S. Hailu", date: "2025-11-01", price: 620 },
                    ].map((r) => (
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
          </aside>
        </div>
      </main>
    </>
  );
}
