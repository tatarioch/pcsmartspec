import { NextResponse } from 'next/server';
import { updateScan, getScan } from '@/lib/scanStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, price, extras } = body || {};
    if (!id) {
      return NextResponse.json({ status: 'error', error: 'Missing id' }, { status: 400 });
    }

    const existing = await getScan(id as string);
    if (!existing) {
      return NextResponse.json({ status: 'error', error: 'Scan not found' }, { status: 404 });
    }

    const updated = await updateScan(id, {
      status: 'published',
      title: title ?? `${existing.Brand} ${existing.Model}`,
      price: price ?? '',
      ...(extras || {}),
      publishedAt: new Date().toISOString(),
    } as any);

    return NextResponse.json({ status: 'ok', data: updated });
  } catch (e) {
    return NextResponse.json({ status: 'error', error: 'Failed to publish' }, { status: 500 });
  }
}
