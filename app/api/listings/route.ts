import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

type Listing = Database['public']['Tables']['listings']['Row'] & {
  imageUrl?: string;
  Brand?: string;
  Model?: string;
  CPU?: string;
  RAM_GB?: string;
  RAM_Type?: string;
  RAM_Speed_MHz?: string;
  Storage?: any[];
  GPU?: string;
  Display_Resolution?: string;
  Screen_Size_inch?: number;
  OS?: string;
  Scan_Time?: string;
  status?: string;
  createdAt?: string;
};

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Fetch listings with status 'published' and order by creation date
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match the frontend's expected format
    const formattedListings = (listings || []).map((listing: Database['public']['Tables']['listings']['Row']) => ({
      id: listing.id,
      Brand: listing.brand || '',
      Model: listing.model || '',
      CPU: listing.cpu || '',
      RAM_GB: listing.ram_gb || '',
      RAM_Type: listing.ram_type || '',
      RAM_Speed_MHz: listing.ram_speed_mhz || '',
      Storage: listing.storage || [],
      GPU: listing.gpu || '',
      Display_Resolution: listing.display_resolution || '',
      Screen_Size_inch: listing.screen_size_inch || 0,
      OS: listing.os || '',
      createdAt: listing.created_at,
      status: listing.status,
      price: listing.price,
      description: listing.description,
      // Add image URL if available
      ...(listing.images && listing.images.length > 0 && {
        imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${listing.images[0]}`
      })
    }));

    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        data: formattedListings 
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching listings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        error: 'Failed to load listings',
        details: errorMessage 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
