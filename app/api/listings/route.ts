import { createSupabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const admin = createSupabaseAdmin();
    const { data, error } = await admin
      .from('listings')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const listings = (data || []).map((r: any) => ({
      id: r.id,
      Brand: r.brand,
      Model: r.model,
      CPU: r.cpu,
      RAM_GB: r.ram_gb,
      RAM_Type: r.ram_type,
      RAM_Speed_MHz: r.ram_speed_mhz,
      Storage: r.storage || [],
      GPU: r.gpu,
      Display_Resolution: r.display_resolution,
      Screen_Size_inch: r.screen_size_inch,
      OS: r.os,
      createdAt: r.created_at,
      status: r.status,
      price: r.price,
      description: r.description,
      // Use the image URLs as they are from the database
      images: r.images || [],
      // Keep the first image as a separate field for the card view
      imageUrl: r.images?.[0] || null,
      // Include all the original data in case we need it
      ...r
    }));

    return new Response(JSON.stringify({ status: 'ok', data: listings }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ status: 'error', error: error?.message || 'Failed to load listings' }), { status: 500 });
  }
}
