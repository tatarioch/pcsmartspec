"use client";

import { useState, type ChangeEvent } from "react";

type SpecsState = {
  brand: string;
  ram: string;
  storageType: string;
  storageSize: string;
  processor: string;
};

export type NewComputerData = {
  name: string;
  price: number;
  negotiable: boolean;
  specs: string;
  images: string[];
};

export default function NewComputerModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: NewComputerData) => void;
}) {
  const [uPrice, setUPrice] = useState<string | number>("");
  const [uNegotiable, setUNegotiable] = useState(true);
  const [uSpecs, setUSpecs] = useState<SpecsState>({
    brand: "",
    ram: "",
    storageType: "",
    storageSize: "",
    processor: "",
  });
  const [uImages, setUImages] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");
  const [additionalSpecs, setAdditionalSpecs] = useState<string>("");
  const [series, setSeries] = useState<string>("");
  const [condition, setCondition] = useState<string>("");

  // CPU
  const [cpuBrand, setCpuBrand] = useState<string>("");
  const [cpuSeries, setCpuSeries] = useState<string>("");
  const [cpuGeneration, setCpuGeneration] = useState<string>("");
  const [cpuModel, setCpuModel] = useState<string>("");

  // RAM & Storage
  const [ramType, setRamType] = useState<string>("");
  const [ramCapacity, setRamCapacity] = useState<string>("");
  const [storageTypeMain, setStorageTypeMain] = useState<string>("");
  const [storageSubtype, setStorageSubtype] = useState<string>("");
  const [storageCapacity, setStorageCapacity] = useState<string>("");

  // Display
  const [screenSize, setScreenSize] = useState<string>("");
  const [resolution, setResolution] = useState<string>("");
  const [displayTech, setDisplayTech] = useState<string>("");
  const [refreshRate, setRefreshRate] = useState<string>("");

  // GPU
  const [gpuType, setGpuType] = useState<string>("");
  const [gpuBrand, setGpuBrand] = useState<string>("");
  const [gpuSeries, setGpuSeries] = useState<string>("");
  const [gpuModel, setGpuModel] = useState<string>("");

  // Contact
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const limited = Array.from(files).slice(0, 5);
    const previews: string[] = await Promise.all(
      limited.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(f);
          })
      )
    );
    setUImages(previews);
  };

  const buildSpecsString = (s: SpecsState) => {
    const cpuSummary = [cpuBrand, cpuSeries, cpuGeneration, cpuModel].filter(Boolean).join(" ");
    const memSummary = [ramType && `RAM Type: ${ramType}`, ramCapacity && `RAM: ${ramCapacity}`].filter(Boolean).join(" | ");
    const storageSummary = [
      storageTypeMain && `Storage: ${storageTypeMain}`,
      storageSubtype && `Sub-type: ${storageSubtype}`,
      storageCapacity && `Capacity: ${storageCapacity}`,
    ]
      .filter(Boolean)
      .join(" | ");
    const displaySummary = [
      screenSize && `Screen: ${screenSize}`,
      resolution && `Resolution: ${resolution}`,
      displayTech && `Tech: ${displayTech}`,
      refreshRate && `Refresh: ${refreshRate}`,
    ]
      .filter(Boolean)
      .join(" | ");
    const gpuSummary = [gpuType, gpuBrand, gpuSeries, gpuModel].filter(Boolean).join(" ");

    return [
      s.brand && `Brand: ${s.brand}${series ? ` (${series}${model ? ` ${model}` : ""})` : ""}`,
      condition && `Condition: ${condition}`,
      cpuSummary && `CPU: ${cpuSummary}`,
      memSummary,
      storageSummary,
      displaySummary,
      gpuSummary && `GPU: ${gpuSummary}`,
      s.ram && `Legacy RAM: ${s.ram}`,
      s.storageType && `Legacy Storage Type: ${s.storageType}`,
      s.storageSize && `Legacy Storage Size: ${s.storageSize}`,
      s.processor && `Legacy Processor: ${s.processor}`,
      warranty && `Warranty: ${warranty}`,
      phoneNumber && `Phone: ${phoneNumber}`,
      telegram && `Telegram: ${telegram}`,
      additionalSpecs && additionalSpecs,
    ]
      .filter(Boolean)
      .join(" | ");
  };

  const addAndClose = () => {
    if (!uSpecs.brand) return;
    const specsString = buildSpecsString(uSpecs);
    const computedName = [uSpecs.brand, series, model].filter(Boolean).join(" ");
    onAdd({
      name: computedName,
      price: Number(uPrice || 0),
      negotiable: uNegotiable,
      specs: specsString,
      images: uImages,
    });
    setUPrice("");
    setUNegotiable(true);
    setUSpecs({ brand: "", ram: "", storageType: "", storageSize: "", processor: "" });
    setUImages([]);
    setModel("");
    setSeries("");
    setCondition("");
    setCpuBrand("");
    setCpuSeries("");
    setCpuGeneration("");
    setCpuModel("");
    setRamType("");
    setRamCapacity("");
    setStorageTypeMain("");
    setStorageSubtype("");
    setStorageCapacity("");
    setScreenSize("");
    setResolution("");
    setDisplayTech("");
    setRefreshRate("");
    setGpuType("");
    setGpuBrand("");
    setGpuSeries("");
    setGpuModel("");
    setPhoneNumber("");
    setTelegram("");
    setAdditionalSpecs("");
    onClose();
  };

  // Mappings
  const seriesByBrand: Record<string, string[]> = {
    Dell: ["XPS", "Latitude", "Inspiron", "Vostro", "Alienware"],
    HP: ["Pavilion", "EliteBook", "ProBook", "Omen", "Spectre"],
    Lenovo: ["ThinkPad", "IdeaPad", "Legion", "Yoga"],
    Apple: ["MacBook Air", "MacBook Pro", "iMac"],
    Asus: ["ZenBook", "VivoBook", "ROG", "TUF"],
  };

  const modelsBySeries: Record<string, string[]> = {
    XPS: ["13", "15", "17"],
    Latitude: ["5000", "7000"],
    Inspiron: ["3000", "5000", "7000"],
    Vostro: ["3000", "5000"],
    Alienware: ["m15", "x16"],
    Pavilion: ["15", "Gaming 15"],
    EliteBook: ["840", "850"],
    ProBook: ["450", "455"],
    Omen: ["16", "Transcend 14"],
    Spectre: ["x360 13", "x360 14", "x360 16"],
    ThinkPad: ["T14", "X1 Carbon", "P1"],
    IdeaPad: ["3", "5", "Gaming 3"],
    Legion: ["5", "7"],
    Yoga: ["7", "9"],
    "MacBook Air": ["M1", "M2", "M3"],
    "MacBook Pro": ["M1 Pro", "M2 Pro", "M3 Pro"],
    iMac: ["24\" M1", "24\" M3"],
    ZenBook: ["14", "Pro 16X"],
    VivoBook: ["15", "S 14"],
    ROG: ["Zephyrus G14", "Strix G16"],
    TUF: ["A15", "F15"],
  };

  const cpuSeriesByBrand: Record<string, string[]> = {
    Intel: ["Core i3", "Core i5", "Core i7", "Core i9"],
    AMD: ["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9"],
  };

  const cpuGenBySeries: Record<string, string[]> = {
    "Core i3": ["10th", "11th", "12th", "13th", "14th"],
    "Core i5": ["10th", "11th", "12th", "13th", "14th"],
    "Core i7": ["10th", "11th", "12th", "13th", "14th"],
    "Core i9": ["10th", "11th", "12th", "13th", "14th"],
    "Ryzen 3": ["3000", "4000", "5000", "7000"],
    "Ryzen 5": ["3000", "4000", "5000", "7000"],
    "Ryzen 7": ["3000", "4000", "5000", "7000"],
    "Ryzen 9": ["3000", "4000", "5000", "7000"],
  };

  const cpuModelsByGen: Record<string, string[]> = {
    "10th": ["10110U", "10400H"],
    "11th": ["1135G7", "11800H"],
    "12th": ["1235U", "12700H"],
    "13th": ["13420H", "13700H"],
    "14th": ["14650HX", "14900HX"],
    "3000": ["3500U"],
    "4000": ["4500U", "4800H"],
    "5000": ["5500U", "5800H"],
    "7000": ["7530U", "7840HS"],
  };

  const ramCapByType: Record<string, string[]> = {
    DDR4: ["4GB", "8GB", "16GB", "32GB"],
    DDR5: ["8GB", "16GB", "24GB", "32GB", "64GB"],
    LPDDR4: ["4GB", "8GB", "16GB"],
    LPDDR5: ["8GB", "16GB", "32GB"],
  };

  const storageSubtypeByType: Record<string, string[]> = {
    ssd: ["SATA", "NVMe"],
    hdd: ["5400rpm", "7200rpm"],
    hybrid: ["SSHD"],
  };

  const storageCapBySubtype: Record<string, string[]> = {
    SATA: ["128GB", "256GB", "512GB", "1TB", "2TB"],
    NVMe: ["256GB", "512GB", "1TB", "2TB"],
    "5400rpm": ["500GB", "1TB", "2TB"],
    "7200rpm": ["1TB", "2TB"],
    SSHD: ["1TB", "2TB"],
  };

  const gpuBrandByType: Record<string, string[]> = {
    Integrated: ["Intel", "AMD"],
    Dedicated: ["NVIDIA", "AMD"],
  };

  const gpuSeriesByBrand: Record<string, string[]> = {
    Intel: ["Iris Xe", "UHD"],
    AMD: ["Radeon Vega", "Radeon RX"],
    NVIDIA: ["GTX 16", "RTX 20", "RTX 30", "RTX 40"],
  };

  const gpuModelsBySeries: Record<string, string[]> = {
    "Iris Xe": ["G7"],
    UHD: ["620"],
    "Radeon Vega": ["8", "10"],
    "Radeon RX": ["6600M", "7600S"],
    "GTX 16": ["1650", "1660 Ti"],
    "RTX 20": ["2060", "2070", "2080"],
    "RTX 30": ["3050", "3060", "3070", "3080"],
    "RTX 40": ["4050", "4060", "4070", "4080", "4090"],
  };

  const warrantyOptions = [
    "No Warranty",
    "1 Month",
    "3 Months",
    "6 Months",
    "1 Year",
    "2 Years",
    "3 Years",
  ];

  const [warranty, setWarranty] = useState<string>("");

  async function handleGeneratePost() {
    const title = [uSpecs.brand, series, model].filter(Boolean).join(" ");
    const parts = [
      `Condition: ${condition || "—"}`,
      cpuBrand && `CPU: ${[cpuBrand, cpuSeries, cpuGeneration, cpuModel].filter(Boolean).join(" ")}`,
      (ramType || ramCapacity) && `Memory: ${[ramType, ramCapacity].filter(Boolean).join(" ")}`,
      (storageTypeMain || storageSubtype || storageCapacity) && `Storage: ${[storageTypeMain, storageSubtype, storageCapacity].filter(Boolean).join(" ")}`,
      (screenSize || resolution || displayTech || refreshRate) && `Display: ${[screenSize, resolution, displayTech, refreshRate].filter(Boolean).join(" • ")}`,
      (gpuType || gpuBrand || gpuSeries || gpuModel) && `Graphics: ${[gpuType, gpuBrand, gpuSeries, gpuModel].filter(Boolean).join(" ")}`,
      warranty && `Warranty: ${warranty}`,
      additionalSpecs && `Notes: ${additionalSpecs}`,
      `Price: ${uPrice ? `${uPrice} Birr` : "—"}`,
      phoneNumber && `Phone: ${phoneNumber}`,
      telegram && `Telegram: ${telegram}`,
    ].filter(Boolean);
    const post = `📦 ${title || "Laptop"}\n\n${parts.join("\n")}`;
    try {
      await navigator.clipboard.writeText(post);
      alert("Post copied to clipboard");
    } catch {
      // fallback: no-op
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full mt-80 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-fadeIn">
        <div className="mb-6 flex items-left justify-end  top-0 bg-white">
          <button className="  transition-colors duration-200 hover:cursor-pointer" onClick={onClose}>
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Price ($)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 appearance-none focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              value={uPrice}
              onChange={(e) => {
                const value = e.target.value;
                setUPrice(value === "" ? "" : Number(value));
              }}
            />
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <input
              id="u-neg"
              type="checkbox"
              checked={uNegotiable}
              onChange={(e) => setUNegotiable(e.target.checked)}
              className="rounded border-slate-400 text-blue-600 focus:ring-blue-300"
            />
            <label htmlFor="u-neg" className="text-sm font-medium text-slate-700">
              <i className="fa-regular fa-handshake mr-2" />
              Price is negotiable
            </label>
          </div>
          {/* Brand (mandatory) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Brand</label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
              value={uSpecs.brand}
              onChange={(e) => {
                setUSpecs((prev) => ({ ...prev, brand: e.target.value }));
                setModel("");
              }}
            >
              <option value="">Select Brand</option>
              {(["Dell", "HP", "Lenovo", "Apple", "Asus"]).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Model (depends on Brand) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Model</label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!uSpecs.brand}
            >
              <option value="">Select Model</option>
              {(
                {
                  Dell: ["XPS", "Latitude", "Inspiron", "Vostro", "Alienware"],
                  HP: ["Pavilion", "EliteBook", "ProBook", "Omen", "Spectre"],
                  Lenovo: ["ThinkPad", "IdeaPad", "Legion", "Yoga"],
                  Apple: ["MacBook Air", "MacBook Pro", "iMac"],
                  Asus: ["ZenBook", "VivoBook", "ROG", "TUF"],
                } as Record<string, string[]>
              )[uSpecs.brand]?
                (
                  ( {
                    Dell: ["XPS", "Latitude", "Inspiron", "Vostro", "Alienware"],
                    HP: ["Pavilion", "EliteBook", "ProBook", "Omen", "Spectre"],
                    Lenovo: ["ThinkPad", "IdeaPad", "Legion", "Yoga"],
                    Apple: ["MacBook Air", "MacBook Pro", "iMac"],
                    Asus: ["ZenBook", "VivoBook", "ROG", "TUF"],
                  } as Record<string, string[]>)[uSpecs.brand].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : null
              }
            </select>
          </div>

          {/* Other specs */}
          {[
            { label: "RAM", key: "ram", options: ["4GB", "8GB", "16GB", "32GB"] },
            { label: "Storage Type", key: "storageType", options: ["SSD", "HDD", "Hybrid"] },
            { label: "Storage Size", key: "storageSize", options: ["128GB", "256GB", "512GB", "1TB"] },
            { label: "Processor", key: "processor", options: ["Intel i5", "Intel i7", "AMD Ryzen 5", "M1/M2"] },
          ].map((spec: any) => (
            <div key={spec.key} className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{spec.label}</label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                value={(uSpecs as any)[spec.key]}
                onChange={(e) => setUSpecs((prev) => ({ ...prev, [spec.key]: e.target.value }))}
              >
                <option value="">Select {spec.label}</option>
                {spec.options.map((opt: string) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Additional Specifications (optional) */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Additional Specifications (optional)</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none resize-none"
              value={additionalSpecs}
              onChange={(e) => setAdditionalSpecs(e.target.value)}
              placeholder="Any extra details..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Images (max 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handleImageUpload}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 transition-all duration-200"
            />
            {uImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {uImages.map((src, idx) => (
                  <div key={idx} className="relative h-24 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 group">
                    <img src={src} alt="preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                      <button className="bg-green-500 p-2 rounded-full text-white" title="Approve">
                        <i className="fa-solid fa-check" />
                      </button>
                      <button
                        className="bg-red-500 p-2 rounded-full text-white"
                        title="Remove"
                        onClick={() => setUImages((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-700 font-medium hover:bg-slate-50 hover:scale-105 transition" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl border border-blue-300 bg-white px-6 py-3 text-blue-700 font-medium hover:bg-blue-50 hover:scale-105 transition"
            onClick={handleGeneratePost}
          >
            🚀 Generate Post
          </button>
          <button
            className="rounded-xl bg-linear-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-medium hover:shadow-lg hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={addAndClose}
            disabled={!uSpecs.brand}
          >
            <i className="fa-solid fa-plus mr-2" />
            Add Device
          </button>
        </div>
      </div>
    </div>
  );
}
