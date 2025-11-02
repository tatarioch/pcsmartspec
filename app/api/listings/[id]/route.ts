import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const admin = createSupabaseAdmin();

    // Prepare update payload - only include fields that exist in schema
    const updateData: any = {};

    // Map only valid fields from request body
    if (body.price !== undefined) updateData.price = body.price;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.model !== undefined) updateData.model = body.model;
    if (body.cpu !== undefined) updateData.cpu = body.cpu;
    if (body.ram_gb !== undefined) updateData.ram_gb = body.ram_gb;
    if (body.ram_type !== undefined) updateData.ram_type = body.ram_type;
    if (body.ram_speed_mhz !== undefined) updateData.ram_speed_mhz = body.ram_speed_mhz;
    if (body.gpu !== undefined) updateData.gpu = body.gpu;
    if (body.screen_size_inch !== undefined) updateData.screen_size_inch = body.screen_size_inch;
    if (body.display_resolution !== undefined) updateData.display_resolution = body.display_resolution;
    if (body.os !== undefined) updateData.os = body.os;
    if (body.storage !== undefined) updateData.storage = body.storage;
    
    const { data, error } = await admin
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ status: 'ok', data });
  } catch (error: any) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { status: 'error', error: error?.message || 'Failed to update listing' },
      { status: 500 }
    );
  }
}

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
