import { getLatestScan } from '@/lib/scanStore';

export async function GET() {
  try {
    const latest = await getLatestScan();
    if (!latest) {
      return new Response(JSON.stringify({ status: 'error', error: 'No scans available' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      });
    }
    return new Response(JSON.stringify({ status: 'ok', data: latest }), {
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
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', error: 'Failed to fetch latest scan' }), { status: 500 });
  }
}
