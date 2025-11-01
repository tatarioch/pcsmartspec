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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">Analytics</h1>
            <p className="text-xs text-zinc-500">Engagement and performance</p>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/admin" className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Dashboard</a>
            <a href="/admin/sold" className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Sold</a>
            <a href="/admin/analytics" className="rounded-md px-3 py-2 text-sm bg-zinc-900 text-white">Analytics</a>
            <a href="/admin/attach" className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Attach</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
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
          </aside>
        </div>
      </main>
    </div>
  );
}
