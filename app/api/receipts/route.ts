import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      listing_id,
      receipt_number,
      buyer_name,
      buyer_phone,
      buyer_address,
      purchase_price,
      seller_signature,
      pc_specs_snapshot,
      notes,
    } = body;

    // Validate required fields
    if (!receipt_number || !buyer_name || !buyer_phone || purchase_price === undefined) {
      return NextResponse.json(
        { status: 'error', error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdmin();

    // Insert receipt into database
    const { data, error } = await admin
      .from('receipts')
      .insert({
        listing_id: listing_id || null,
        receipt_number,
        buyer_name,
        buyer_phone,
        buyer_address: buyer_address || null,
        purchase_price: parseFloat(purchase_price),
        seller_signature: seller_signature || null,
        pc_specs_snapshot,
        notes: notes || null,
        sale_date: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating receipt:', error);
      return NextResponse.json(
        { status: 'error', error: error.message || 'Failed to create receipt' },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'ok', data });
  } catch (error: any) {
    console.error('Error in receipts API:', error);
    return NextResponse.json(
      { status: 'error', error: error?.message || 'Failed to create receipt' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deleted = searchParams.get('deleted');

    const admin = createSupabaseAdmin();
    let query = admin.from('receipts').select('*');

    // If deleted=false or not specified, only get non-deleted receipts
    if (deleted !== 'true') {
      query = query.is('deleted_at', null);
    }

    query = query.order('sale_date', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching receipts:', error);
      return NextResponse.json(
        { status: 'error', error: error.message || 'Failed to fetch receipts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'ok', data: data || [] });
  } catch (error: any) {
    console.error('Error in receipts API:', error);
    return NextResponse.json(
      { status: 'error', error: error?.message || 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}

