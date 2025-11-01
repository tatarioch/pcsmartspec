import { promises as fs } from 'fs';
import path from 'path';

// Define the path for the data file
const DATA_FILE = path.join(process.cwd(), 'data', 'scans.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    // Initialize file if it doesn't exist
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, '{}', 'utf-8');
    }
  } catch (error) {
    console.error('Error initializing data directory:', error);
  }
}

// Initialize the data directory
ensureDataDirectory().catch(console.error);

type ScanData = {
  id: string;
  Brand: string;
  Model: string;
  CPU: string;
  Cores: string;
  Threads: string;
  BaseSpeed_MHz: string;
  RAM_GB: string;
  RAM_Speed_MHz: string;
  RAM_Type: string;
  Storage: Array<{
    Model: string;
    Size_GB: number;
    Type: string;
    BusType: string;
  }>;
  GPU: string;
  Display_Resolution: string;
  Screen_Size_inch: number;
  OS: string;
  Scan_Time: string;
  createdAt: string;
  status: string;
};

async function readStore() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Record<string, ScanData>;
  } catch (error) {
    console.error('Error reading scan store:', error);
    return {};
  }
}

async function writeStore(store: Record<string, ScanData>) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to scan store:', error);
  }
}

export const getScan = async (id: string): Promise<ScanData | undefined> => {
  const store = await readStore();
  return store[id];
};

export const setScan = async (id: string, data: Omit<ScanData, 'id'>): Promise<void> => {
  const store = await readStore();
  store[id] = { ...data, id };
  await writeStore(store);
};

export const deleteScan = async (id: string): Promise<void> => {
  const store = await readStore();
  if (store[id]) {
    delete store[id];
    await writeStore(store);
  }
};

export const getLatestScan = async (): Promise<ScanData | undefined> => {
  const store = await readStore();
  const entries = Object.values(store);
  if (!entries.length) return undefined;
  // Pick the most recent by createdAt (fallback to Scan_Time if needed)
  return entries.sort((a, b) => {
    const ta = Date.parse(a.createdAt || a.Scan_Time || '');
    const tb = Date.parse(b.createdAt || b.Scan_Time || '');
    return tb - ta;
  })[0];
};
