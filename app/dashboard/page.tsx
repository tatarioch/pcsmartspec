"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewComputerModal, { type NewComputerData } from "../components/NewComputerModal";
import EditListingModal from "../components/EditListingModal";

export type Listing = {
  id: string;
  brand: string | null;
  model: string | null;
  cpu: string | null;
  ram_gb: string | null;
  ram_type: string | null;
  gpu: string | null;
  display_resolution: string | null;
  screen_size_inch: number | null;
  os: string | null;
  price: number | null;
  description: string | null;
  images: string[] | null;
  status: 'draft' | 'published' | 'sold';
  created_at: string;
  updated_at: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'sold'>('all');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: Currently there's no user-specific endpoint, so this fetches all published listings
      // In a real app, you'd fetch /api/listings/my-listings or similar
      const res = await fetch('/api/listings', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load listings');
      
      const data = await res.json();
      if (data.status === 'ok') {
        // Transform to internal format
        const transformed: Listing[] = data.data.map((item: any) => ({
          id: item.id,
          brand: item.brand || item.Brand || null,
          model: item.model || item.Model || null,
          cpu: item.cpu || item.CPU || null,
          ram_gb: item.ram_gb || item.RAM_GB || null,
          ram_type: item.ram_type || item.RAM_Type || null,
          gpu: item.gpu || item.GPU || null,
          display_resolution: item.display_resolution || item.Display_Resolution || null,
          screen_size_inch: item.screen_size_inch || item.Screen_Size_inch || null,
          os: item.os || item.OS || null,
          price: item.price || null,
          description: item.description || null,
          images: item.images || null,
          status: item.status || 'published',
          created_at: item.created_at || item.createdAt || new Date().toISOString(),
          updated_at: item.updated_at || null,
        }));
        setListings(transformed);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load listings');
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  const stats = {
    total: listings.length,
    published: listings.filter(l => l.status === 'published').length,
    draft: listings.filter(l => l.status === 'draft').length,
    sold: listings.filter(l => l.status === 'sold').length,
  };

  const handleAddFromModal = async (data: NewComputerData): Promise<boolean> => {
    try {
      const payload = {
        title: data.name,
        price: String(data.price ?? ""),
        negotiable: data.negotiable,
        brand: data.brand,
        series: data.series,
        model: data.model,
        condition: data.condition,
        batteryCondition: data.batteryCondition,
        extraItems: data.extraItems,
        warranty: data.warranty,
        refreshRate: data.refreshRate,
        cpuBrand: data.cpuBrand,
        cpuSeries: data.cpuSeries,
        cpuGeneration: data.cpuGeneration,
        cpuModel: data.cpuModel,
        ramType: data.ramType,
        ramCapacity: data.ramCapacity,
        storageTypeMain: data.storageTypeMain,
        storageCapacity: data.storageCapacity,
        screenSize: data.screenSize,
        resolution: data.resolution,
        gpuType: data.gpuType,
        gpuBrand: data.gpuBrand,
        gpuSeries: data.gpuSeries,
        gpuVram: data.gpuVram,
        specs: data.specs,
        images: data.images,
      };

      const res = await fetch('/api/listings/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json: any = null;
      try { json = text ? JSON.parse(text) : null; } catch {}

      if (!res.ok) {
        alert(`❌ Save failed: ${res.status} ${res.statusText}`);
        return false;
      }

      alert('✅ Listing published successfully!');
      setUploadOpen(false);
      loadListings(); // Reload to show the new listing
      return true;
    } catch (err: any) {
      console.error('Error publishing listing:', err);
      alert(`❌ Error: ${err?.message || 'Unknown error'}`);
      return false;
    }
  };

  const handleUpdateListing = async (id: string, data: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || result.status !== 'ok') {
        alert(`❌ Update failed: ${result.error || 'Unknown error'}`);
        return false;
      }

      alert('✅ Listing updated successfully!');
      loadListings(); // Reload to show the updated listing
      return true;
    } catch (err: any) {
      console.error('Error updating listing:', err);
      alert(`❌ Error: ${err?.message || 'Unknown error'}`);
      return false;
    }
  };

  const handleEditClick = (listing: Listing) => {
    setSelectedListing(listing);
    setEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your listings</p>
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Listing
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-600">Total Listings</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
              <div className="text-sm font-medium text-green-700">Published</div>
              <div className="text-2xl font-bold text-green-900 mt-1">{stats.published}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
              <div className="text-sm font-medium text-yellow-700">Draft</div>
              <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.draft}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-700">Sold</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.sold}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {(['all', 'published', 'draft', 'sold'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Image */}
                <Link href={`/listings/${listing.id}`}>
                  <div className="relative h-48 w-full bg-gray-100">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={`${listing.brand} ${listing.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-laptop.jpg';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {listing.brand} {listing.model}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {listing.description || 'No description'}
                      </p>
                    </div>
                    {listing.price && (
                      <div className="text-xl font-bold text-blue-600 ml-2">
                        ${listing.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Specs */}
                  <div className="space-y-1 text-xs text-gray-600 mb-4">
                    {listing.cpu && <div>CPU: {listing.cpu}</div>}
                    {listing.ram_gb && listing.ram_type && (
                      <div>{listing.ram_gb}GB {listing.ram_type}</div>
                    )}
                    {listing.gpu && <div>GPU: {listing.gpu}</div>}
                    {listing.screen_size_inch && listing.display_resolution && (
                      <div>{listing.screen_size_inch}" {listing.display_resolution}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : listing.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {listing.status === 'published' && '✓ Published'}
                      {listing.status === 'draft' && '📝 Draft'}
                      {listing.status === 'sold' && '✓ Sold'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(listing)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "Get started by creating your first listing"
                : `No ${filter} listings yet`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Listing
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* New Listing Modal */}
      <NewComputerModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onAdd={handleAddFromModal}
      />

      {/* Edit Listing Modal */}
      <EditListingModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedListing(null);
        }}
        listing={selectedListing}
        onUpdate={handleUpdateListing}
      />
    </div>
  );
}