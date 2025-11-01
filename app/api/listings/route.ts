import { getAllScans } from '@/lib/scanStore';

export async function GET() {
  try {
    const scans = await getAllScans();
    const listings = scans
      .filter((s) => (s as any).status === 'published')
      .sort((a, b) => Date.parse(b.createdAt || b.Scan_Time || '') - Date.parse(a.createdAt || a.Scan_Time || ''))
      .map((s) => ({
        id: s.id,
        Brand: s.Brand,
        Model: s.Model,
        CPU: s.CPU,
        RAM_GB: s.RAM_GB,
        RAM_Type: s.RAM_Type,
        RAM_Speed_MHz: s.RAM_Speed_MHz,
        Storage: s.Storage,
        GPU: s.GPU,
        Display_Resolution: s.Display_Resolution,
        Screen_Size_inch: s.Screen_Size_inch,
        OS: s.OS,
        Scan_Time: s.Scan_Time,
        createdAt: s.createdAt,
        status: s.status,
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
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', error: 'Failed to load listings' }), { status: 500 });
  }
}
