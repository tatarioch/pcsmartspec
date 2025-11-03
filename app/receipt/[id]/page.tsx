"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Receipt {
  id: string;
  listing_id: string | null;
  receipt_number: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_address: string | null;
  sale_date: string;
  purchase_price: number;
  seller_signature: string | null;
  pc_specs_snapshot: any;
  notes: string | null;
  created_at: string;
}

export default function ReceiptViewPage() {
  const router = useRouter();
  const params = useParams();
  const receiptId = params.id as string;

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!receiptId) {
      router.push("/dashboard");
      return;
    }

    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/receipts/${receiptId}`, { cache: "no-store" });
        const result = await res.json();

        if (!res.ok || result.status !== "ok") {
          setError(result.error || "Receipt not found");
          return;
        }

        setReceipt(result.data);
      } catch (err: any) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [receiptId, router]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{error || "Receipt not found"}</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const pcSpecs = receipt.pc_specs_snapshot || {};

  return (
    <>
      <style jsx global>{`
        @media print {
          nav,
          footer,
          .no-print,
          .print-button,
          header,
          #__next > header,
          #__next > footer {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .receipt-container {
            max-width: 210mm !important;
            width: 210mm !important;
            height: 148mm !important; /* Half of A4 height (297mm) */
            margin: 0 auto !important;
            padding: 12mm !important;
            box-shadow: none !important;
            border: 1px solid black !important;
            page-break-after: always !important;
            overflow: hidden !important;
          }
          @page {
            size: A4;
            margin: 0 !important;
          }
          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
          }
          /* Remove any Next.js or localhost text */
          body::after,
          body::before,
          *::after,
          *::before {
            content: none !important;
          }
          /* Hide any links or URLs */
          a[href^="http"],
          a[href^="//"],
          a[href^="/"] {
            text-decoration: none !important;
            color: black !important;
          }
          a[href^="http"]::after,
          a[href^="//"]::after {
            content: none !important;
          }
          /* Hide Next.js development info */
          [data-nextjs-scroll-focus-boundary],
          [nextjs-portal] {
            display: none !important;
          }
          /* Remove any URL text from print */
          .container,
          main {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Hide any script-generated content */
          script,
          style:not([data-jsx]),
          noscript {
            display: none !important;
          }
          /* Remove page title from print */
          title {
            display: none !important;
          }
          /* Ensure no background colors on print */
          * {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .receipt-container * {
            background: transparent !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 print:bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-2xl print:max-w-none">
          {/* Print Button - Hidden when printing */}
          <div className="mb-6 print:hidden print-button">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print / Save PDF
            </button>
          </div>

          {/* Receipt Container */}
          <div className="receipt-container bg-white border border-gray-400 rounded-none p-6 shadow-sm print:shadow-none print:border-2 print:border-black" style={{ maxWidth: '210mm', width: '210mm', height: '148mm', margin: '0 auto' }}>
            {/* Company Header */}
            <div className="text-center mb-4 border-b border-gray-400 pb-3 print:border-black">
              <h1 className="text-xl font-bold text-black mb-1">PCSmartSpec</h1>
              <p className="text-xs text-black">Computer Sales & Service</p>
              <div className="mt-1 text-xs text-black space-y-0">
                <p>Phone: +251 911 234 567</p>
                <p>Addis Ababa, Ethiopia</p>
              </div>
            </div>

            {/* Receipt Number & Date */}
            <div className="mb-3 pb-2 border-b border-gray-400 print:border-black">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Receipt No:</p>
                  <p className="text-sm font-semibold text-black">{receipt.receipt_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-0.5">Sale Date:</p>
                  <p className="text-sm font-semibold text-black">{formatDate(receipt.sale_date)}</p>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="mb-3 pb-2 border-b border-gray-400 print:border-black">
              <h2 className="text-sm font-semibold text-black mb-1.5">Buyer Information</h2>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-600">Name:</span>{" "}
                  <span className="font-medium text-black">{receipt.buyer_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>{" "}
                  <span className="font-medium text-black">{receipt.buyer_phone}</span>
                </div>
                {receipt.buyer_address && (
                  <div>
                    <span className="text-gray-600">Address:</span>{" "}
                    <span className="font-medium text-black">{receipt.buyer_address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PC Details - Minimized */}
            <div className="mb-3 pb-2 border-b border-gray-400 print:border-black">
              <h2 className="text-sm font-semibold text-black mb-1.5">Item Details</h2>
              <div className="text-xs space-y-0.5">
                <p className="font-medium text-black">
                  {pcSpecs.brand || "—"} {pcSpecs.model || ""}
                </p>
                {pcSpecs.cpu && (
                  <p className="text-black">
                    <span className="text-gray-600">CPU:</span> {pcSpecs.cpu}
                  </p>
                )}
                {(pcSpecs.ram_gb || pcSpecs.ram_type) && (
                  <p className="text-black">
                    <span className="text-gray-600">RAM:</span> {pcSpecs.ram_gb || ""}{" "}
                    {pcSpecs.ram_type || ""}
                  </p>
                )}
                {pcSpecs.gpu && (
                  <p className="text-black">
                    <span className="text-gray-600">GPU:</span> {pcSpecs.gpu}
                  </p>
                )}
                {(pcSpecs.screen_size_inch || pcSpecs.display_resolution) && (
                  <p className="text-black">
                    <span className="text-gray-600">Display:</span> {pcSpecs.screen_size_inch || ""}
                    " {pcSpecs.display_resolution || ""}
                  </p>
                )}
              </div>
            </div>

            {/* Signature */}
            {receipt.seller_signature && (
              <div className="mb-3 pb-2 border-b border-gray-400 print:border-black">
                <div className="text-xs">
                  <p className="text-gray-600 mb-1">Authorized Signature:</p>
                  <p className="font-medium text-black">{receipt.seller_signature}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-2 border-t border-gray-400 print:border-black text-center text-xs text-black space-y-0.5">
              <p className="font-semibold text-black">Thank you for your purchase!</p>
              <p>For inquiries, contact us at +251 911 234 567</p>
              <p className="mt-1 text-xs">Receipt ID: {receipt.id.substring(0, 8)}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

