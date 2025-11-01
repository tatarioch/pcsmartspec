import { NextResponse } from 'next/server';
import { getScan } from '@/lib/scanStore';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to get the ID
    const { id } = await context.params;
    
    if (!id) {
      console.error('❌ No ID provided in request');
      return new Response(
        JSON.stringify({ status: 'error', error: 'No scan ID provided' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }
    
    console.log(`🔍 Fetching scan data for ID: ${id}`);
    
    // Get the scan data from the shared store
    const scanData = await getScan(id);
    
    if (!scanData) {
      console.error(`❌ Scan not found: ${id}`);
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          error: 'Scan not found',
          requestedId: id,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
          } 
        }
      );
    }
    
    console.log(`✅ Found scan data for ID: ${id}`);
    return new Response(JSON.stringify({
      status: 'ok',
      data: scanData,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      },
    });
    
  } catch (error) {
    console.error('❌ Error in scan API:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        error: 'Failed to fetch scan data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
