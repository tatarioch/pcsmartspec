import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const admin = createSupabaseAdmin();

    const { data, error } = await admin
      .from('receipts')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error fetching receipt:', error);
      return NextResponse.json(
        { status: 'error', error: error.message || 'Receipt not found' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { status: 'error', error: 'Receipt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'ok', data });
  } catch (error: any) {
    console.error('Error in receipt API:', error);
    return NextResponse.json(
      { status: 'error', error: error?.message || 'Failed to fetch receipt' },
      { status: 500 }
    );
  }
}

