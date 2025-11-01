"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface StorageItem {
  Model: string;
  Size_GB: number;
  Type: string;
  BusType: string;
}

interface PcSpec {
  Brand: string;
  Model: string;
  CPU: string;
  Cores: string;
  Threads: string;
  BaseSpeed_MHz: string;
  RAM_GB: string;
  RAM_Speed_MHz: string;
  RAM_Type: string;
  Storage: StorageItem[];
  GPU: string;
  Display_Resolution: string;
  Screen_Size_inch: number;
  OS: string;
  Scan_Time: string;
}

// Mock data that matches the Python scanner output
const mockPcSpec: PcSpec = {
  Brand: "HP",
  Model: "Victus by HP Gaming Laptop 15-fa1xxx",
  CPU: "13th Gen Intel(R) Core(TM) i5-13420H",
  Cores: "8",
  Threads: "12",
  BaseSpeed_MHz: "2100",
  RAM_GB: "16",
  RAM_Speed_MHz: "3200",
  RAM_Type: "DDR4",
  Storage: [
    {
      Model: "PSENN512GA87FC0",
      Size_GB: 512.11,
      Type: "SSD",
      BusType: "NVMe"
    }
  ],
  GPU: "Intel(R) UHD Graphics, NVIDIA GeForce RTX 2050",
  Display_Resolution: "1920x1080",
  Screen_Size_inch: 15.6,
  OS: "Microsoft Windows 11 Home",
  Scan_Time: new Date().toISOString()
};

const sampleSpec: PcSpec = {
  Brand: "HP",
  Model: "Victus by HP Gaming Laptop 15-fa1xxx",
  CPU: "13th Gen Intel(R) Core(TM) i5-13420H",
  Cores: "8",
  Threads: "12",
  BaseSpeed_MHz: "2100",
  RAM_GB: "16",
  RAM_Speed_MHz: "3200",
  RAM_Type: "DDR4",
  Storage: [
    {
      Model: "PSENN512GA87FC0",
      Size_GB: 512.11,
      Type: "SSD",
      BusType: "NVMe",
    },
  ],
  GPU: "Intel(R) UHD Graphics, NVIDIA GeForce RTX 2050",
  Display_Resolution: "1920x1080",
  Screen_Size_inch: 15.6,
  OS: "Microsoft Windows 11 Home",
  Scan_Time: "2025-11-01T13:53:16.784566",
};

// Add this interface at the top with other interfaces
interface FormData {
  brand: string;
  model: string;
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
  display: string;
  condition: string;
  price: string;
  description: string;
}

export default function AttachListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    scanId?: string;
    loadedAt?: string;
    data?: any;
  }>({});

  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    cpu: '',
    ram: '',
    gpu: '',
    storage: '',
    display: '',
    condition: 'New',
    price: '',
    description: '',
  });
  
  const [scannerData, setScannerData] = useState<PcSpec | null>(null);

  // Check for scanner data on component mount
  useEffect(() => {
    const fetchScannerData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if we have scanner data in the URL
        const params = new URLSearchParams(window.location.search);
        const scanId = params.get('scanId');
        
        console.log('🔍 Scan ID from URL:', scanId);
        
        setDebugInfo(prev => ({
          ...prev,
          scanId: scanId || 'none',
          loadedAt: new Date().toISOString()
        }));
        
        if (scanId) {
          console.log(`🔄 Loading scan data for ID: ${scanId}`);
          
          try {
            // Add a timestamp to prevent caching issues
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/scan/${scanId}?t=${timestamp}`, {
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('❌ API Error Response:', errorText);
              throw new Error(`Failed to fetch scan data: ${response.status} ${response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log('📦 Fetched scan data:', responseData);
            
            // The actual scan data is in the 'data' property of the response
            const scanData = responseData.data || responseData;
            console.log('🔍 Raw scan data:', JSON.stringify(scanData, null, 2));
            console.log('🔍 Scan_Time from API:', scanData.Scan_Time);
            
            setScannerData(scanData);
            
            // Format storage information
            const storageInfo = (scanData.Storage || []).map((s: StorageItem) => 
              `${s.Size_GB}GB ${s.Type} ${s.BusType}`
            ).join(' + ');
            
            // Update form with scanner data
            const newFormData = {
              brand: scanData.Brand || '',
              model: scanData.Model || '',
              cpu: scanData.CPU || '',
              ram: scanData.RAM_GB ? `${scanData.RAM_GB}GB ${scanData.RAM_Type || ''} ${scanData.RAM_Speed_MHz || ''}MHz` : '',
              gpu: scanData.GPU || '',
              storage: storageInfo,
              display: scanData.Display_Resolution ? `${scanData.Display_Resolution} (${scanData.Screen_Size_inch || ''}")` : '',
              condition: 'New',
              price: '',
              description: ''
            };
            
            setFormData(newFormData);
            console.log('✅ Form data updated with scan data');
            
            setDebugInfo(prev => ({
              ...prev,
              data: {
                ...scanData,
                Storage: scanData.Storage.map((s: StorageItem) => ({
                  ...s,
                  Size_GB: `${s.Size_GB}GB`
                }))
              }
            }));
          } catch (error) {
            console.error('❌ Error fetching scan data:', error);
            // Fall back to mock data if there's an error
            console.log('⚠️ Falling back to mock data');
            
            const data = mockPcSpec;
            setScannerData(data);
            
            const storageInfo = data.Storage.map((s: StorageItem) => 
              `${s.Size_GB}GB ${s.Type} ${s.BusType}`
            ).join(' + ');
            
            setFormData({
              ...formData,
              brand: data.Brand,
              model: data.Model,
              cpu: data.CPU,
              ram: `${data.RAM_GB}GB ${data.RAM_Type} ${data.RAM_Speed_MHz}MHz`,
              gpu: data.GPU,
              storage: storageInfo,
              display: `${data.Display_Resolution} (${data.Screen_Size_inch}")`
            });
            
            setError('Failed to load scan data. Using sample data instead.');
          }
        } else {
          console.log('ℹ️ No scan ID found in URL');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error loading scanner data:', error);
        setError(`Failed to load scanner data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (typeof window !== 'undefined') {
      fetchScannerData();
    }
  }, [searchParams]);

  function SpecItem({ label, value }: { label: string; value: string | number | undefined }) {
    return (
      <div className="rounded-lg border bg-white p-3">
        <div className="text-xs text-zinc-500">{label}</div>
        <div
          className="text-sm font-medium truncate sm:whitespace-normal sm:overflow-visible sm:text-clip"
          title={value?.toString()}
        >
          {value}
        </div>
      </div>
    );
  }
  const [images, setImages] = useState<string[]>([]);
  const [guaranteeMonths, setGuaranteeMonths] = useState<number>(12);
  const [guaranteeProvider, setGuaranteeProvider] =
    useState<string>("PCSmartSpec");
  const [title, setTitle] = useState<string>(
    `${sampleSpec.Brand} ${sampleSpec.Model}`
  );
  const [price, setPrice] = useState<number | string>(799);
  const [condition, setCondition] = useState<string>("New");
  const [specialFeatures, setSpecialFeatures] = useState<string[]>([]);
  const [specialInput, setSpecialInput] = useState<string>("");
  const [batteryRange, setBatteryRange] = useState<string>("4-5");
  const [batteryOther, setBatteryOther] = useState<string>("");
  const [attached, setAttached] = useState<boolean>(false);
  const [attachedCount, setAttachedCount] = useState<number>(0);
  const suggestions = useMemo(
    () => [
      "Backlit Keyboard",
      "1080p 144Hz",
      "Windows 11 Home",
      "USB-C",
      "Wi‑Fi 6",
      "360 degree hinge",
      "RGB keyboard",
    ],
    []
  );
  const batteryOptions = useMemo(
    () => [
      "1-2",
      "2-3",
      "3-4",
      "4-5",
      "5-6",
      "6-7",
      "7-8",
      "8-9",
      "9-10",
      "Other",
    ],
    []
  );

  const totalStorageGB = useMemo(
    () => sampleSpec.Storage.reduce((sum, s) => sum + s.Size_GB, 0),
    []
  );
  const ramSummary = useMemo(
    () =>
      `${sampleSpec.RAM_GB}GB ${sampleSpec.RAM_Type} ${sampleSpec.RAM_Speed_MHz}MHz`,
    []
  );
  const storageKinds = useMemo(() => {
    const kinds = Array.from(
      new Set(
        (sampleSpec.Storage || []).map((s) =>
          [s.Type, s.BusType].filter(Boolean).join(" ")
        )
      )
    );
    return kinds.join(", ");
  }, []);

  function onSelectImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = Math.max(0, 4 - images.length);
    const toRead = files.slice(0, remaining);
    toRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        setImages((prev) => {
          if (prev.length >= 4) return prev;
          return [...prev, String(reader.result)];
        });
      reader.readAsDataURL(file);
    });
  }

  function addFeature(text: string) {
    const t = text.trim();
    if (!t) return;
    setSpecialFeatures((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setSpecialInput("");
  }

  function removeFeature(text: string) {
    setSpecialFeatures((prev) => prev.filter((f) => f !== text));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function onAttach() {
    if (!images.length) return;
    setAttached(true);
    setAttachedCount(images.length);
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading scanner data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Attach Listing</h1>
        <p className="text-sm text-zinc-500">Create a new product listing</p>
      </div>
      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 lg:col-span-2 xl:col-span-2">
            <div className="text-sm text-zinc-500">Model</div>
            <div className="text-lg font-semibold truncate sm:whitespace-normal sm:overflow-visible sm:text-clip">
              {sampleSpec.Model}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">CPU / RAM</div>
            <div className="text-lg font-semibold">
              {scannerData?.CPU?.split(" ")[0] || 'N/A'} · {ramSummary}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Storage Total</div>
            <div className="text-lg font-semibold">
              {totalStorageGB.toFixed(0)} GB
              {storageKinds ? ` · ${storageKinds}` : ""}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-500">Scan Time</div>
            <div className="text-lg font-semibold">
              {scannerData?.Scan_Time ? formatScanTime(scannerData.Scan_Time) : 'N/A'}
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <section className="space-y-6">
            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Listing Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border p-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
                    Price (ETB)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        setPrice("");
                      } else {
                        setPrice(Number(val));
                      }
                    }}
                    className="w-full rounded-md border p-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-md border p-2 text-sm"
                  >
                    <option>New</option>
                    <option>Like New</option>
                    <option>Used</option>
                    <option>Refurbished</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
                    Battery Life Expectancy
                  </label>
                  <select
                    value={batteryRange}
                    onChange={(e) => setBatteryRange(e.target.value)}
                    className="w-full rounded-md border p-2 text-sm"
                  >
                    {batteryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "Other" ? "Other" : `${opt} hours`}
                      </option>
                    ))}
                  </select>
                  {batteryRange === "Other" && (
                    <input
                      placeholder="e.g. BEST BATTERY LIFE"
                      value={batteryOther}
                      onChange={(e) => setBatteryOther(e.target.value)}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm text-zinc-600">
                    Special Features
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={specialInput}
                      onChange={(e) => setSpecialInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature(specialInput);
                        }
                      }}
                      placeholder="Type a feature and press Enter"
                      className="w-full rounded-md border p-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => addFeature(specialInput)}
                      className="shrink-0 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                    >
                      Add
                    </button>
                  </div>
                  {!!specialFeatures.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {specialFeatures.map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-2 rounded-full border bg-zinc-50 px-3 py-1 text-xs"
                        >
                          {f}
                          <button
                            type="button"
                            onClick={() => removeFeature(f)}
                            className="rounded bg-zinc-200 px-1 text-[10px]"
                            aria-label={`Remove ${f}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <div className="mb-2 text-xs text-zinc-500">
                      Suggestions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => addFeature(s)}
                          className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-zinc-50"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                UI-only; no backend calls.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Spec Preview</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <SpecItem label="Brand" value={sampleSpec.Brand} />
                <SpecItem label="Model" value={sampleSpec.Model} />
                <SpecItem label="CPU" value={sampleSpec.CPU} />
                <SpecItem
                  label="Cores / Threads"
                  value={`${sampleSpec.Cores} / ${sampleSpec.Threads}`}
                />
                <SpecItem
                  label="Base Speed"
                  value={`${sampleSpec.BaseSpeed_MHz} MHz`}
                />
                <SpecItem
                  label="RAM"
                  value={`${sampleSpec.RAM_GB} GB ${sampleSpec.RAM_Type} @ ${sampleSpec.RAM_Speed_MHz} MHz`}
                />
                <SpecItem label="GPU" value={sampleSpec.GPU} />
                <SpecItem
                  label="Display"
                  value={`${sampleSpec.Display_Resolution} · ${sampleSpec.Screen_Size_inch}\"`}
                />
                <SpecItem label="OS" value={sampleSpec.OS} />
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium">Storage</div>
                <ul className="mt-2 divide-y rounded-md border bg-zinc-50">
                  {sampleSpec.Storage.map((s, i) => (
                    <li key={i} className="grid grid-cols-4 gap-2 p-3 text-sm">
                      <div className="col-span-2 truncate sm:whitespace-normal sm:overflow-visible sm:text-clip">
                        {s.Model}
                      </div>
                      <div>
                        {s.Type}/{s.BusType}
                      </div>
                      <div className="text-right">{s.Size_GB} GB</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Photos</h2>
              <div className="flex items-center justify-between gap-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onSelectImages}
                  className="block w-full rounded-md border p-2 text-sm disabled:opacity-50"
                  disabled={images.length >= 4}
                />
                <button
                  onClick={onAttach}
                  className={`rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                    attached ? "bg-emerald-600" : "bg-zinc-900"
                  }`}
                  disabled={!images.length}
                >
                  {attached
                    ? `Attached ${attachedCount} photo${
                        attachedCount === 1 ? "" : "s"
                      }`
                    : "Attach to Listing"}
                </button>
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                {images.length}/4 selected
              </div>
              {attached && (
                <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Photos attached to the draft listing. You can still remove or
                  add before publishing.
                </div>
              )}
              {!!images.length && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-lg border bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-[2px] text-xs font-semibold text-white shadow hover:bg-red-700"
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        ×
                      </button>
                      <img
                        src={src}
                        alt={`upload-${idx}`}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-base font-semibold">Guarantee</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
                    Provider
                  </label>
                  <input
                    value={guaranteeProvider}
                    onChange={(e) => setGuaranteeProvider(e.target.value)}
                    className="w-full rounded-md border p-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={guaranteeMonths}
                    onChange={(e) => setGuaranteeMonths(Number(e.target.value))}
                    className="w-full rounded-md border p-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white">
                    Save Guarantee
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                This is a UI-only mock. No backend calls are made.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button className="rounded-md border px-4 py-2 text-sm font-medium">
            Save Draft
          </button>
          <button
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            disabled={!images.length}
          >
            Publish Listing
          </button>
        </div>
      </main>
    </div>
  );
}

function Bar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / total) * 100)));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-100">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function formatScanTime(dateStr: string) {
  try {
    console.log('📅 Formatting date string:', dateStr);
    
    if (!dateStr) {
      console.warn('⚠️ No date string provided to formatScanTime');
      return 'N/A';
    }
    
    // Create date object
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('❌ Invalid date string:', dateStr);
      return 'Invalid date';
    }
    
    // Format time in Ethiopian timezone (Africa/Addis_Ababa)
    const etTime = date.toLocaleTimeString("en-ET", {
      timeZone: "Africa/Addis_Ababa",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    
    // Format date in Ethiopian timezone
    const etDate = date.toLocaleDateString("en-ET", {
      timeZone: "Africa/Addis_Ababa",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const formattedDate = `${etDate}, ${etTime} (EAT)`;
    console.log('✅ Formatted date:', formattedDate);
    
    return formattedDate;
  } catch (error) {
    console.error('❌ Error formatting date:', error);
    return 'Error formatting date';
  }
}
