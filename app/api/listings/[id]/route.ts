import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const admin = createSupabaseAdmin();
    
    const { data, error } = await admin
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { status: 'error', error: 'Listing not found' },
        { status: 404 }
      );
    }

    const listing = {
      id: data.id,
      Brand: data.brand,
      Model: data.model,
      CPU: data.cpu,
      RAM_GB: data.ram_gb,
      RAM_Type: data.ram_type,
      RAM_Speed_MHz: data.ram_speed_mhz,
      Storage: data.storage || [],
      GPU: data.gpu,
      Display_Resolution: data.display_resolution,
      Screen_Size_inch: data.screen_size_inch,
      OS: data.os,
      price: data.price,
      description: data.description || '',
      images: data.images || [],
      imageUrl: data.images?.[0] || null,
      createdAt: data.created_at,
      status: data.status,
    };

    return NextResponse.json({ status: 'ok', data: listing });
  } catch (error: any) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { status: 'error', error: error?.message || 'Failed to load listing' },
      { status: 500 }
    );
  }
}
