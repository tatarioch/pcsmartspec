'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Listing = {
  id: string;
  Brand: string;
  Model: string;
  CPU: string;
  RAM_GB: string;
  RAM_Type: string;
  RAM_Speed_MHz: string;
  Storage: any[];
  GPU: string;
  Display_Resolution: string;
  Screen_Size_inch: number;
  OS: string;
  price: number;
  description: string;
  images: string[];
  imageUrl: string | null;
  createdAt: string;
};

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`, { cache: 'no-store' });
        const result = await res.json();

        if (!res.ok || result.status !== 'ok') {
          router.push('/404');
          return;
        }

        setListing(result.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
        <Link href="/buyer" className="text-blue-600 hover:underline">
          &larr; Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/buyer" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Listings
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="md:flex">
          <div className="md:w-1/2 p-4">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {listing.imageUrl ? (
                <Image
                  src={listing.imageUrl}
                  alt={`${listing.Brand} ${listing.Model}`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {listing.images.map((img, index) => (
                  <div key={index} className="relative h-20 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={img}
                      alt={`${listing.Brand} ${listing.Model} - ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-laptop.jpg'; // Fallback image
                        target.onerror = null; // Prevent infinite loop if fallback fails
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Listing Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {listing.Brand} {listing.Model}
            </h1>
            
            <div className="text-2xl font-semibold text-blue-600 mb-6">
              ${listing.price?.toLocaleString()}
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">{listing.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Processor</h3>
                <p className="text-gray-900">{listing.CPU}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">RAM</h3>
                <p className="text-gray-900">{listing.RAM_GB}GB {listing.RAM_Type} ({listing.RAM_Speed_MHz}MHz)</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Graphics</h3>
                <p className="text-gray-900">{listing.GPU}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Display</h3>
                <p className="text-gray-900">{listing.Screen_Size_inch}" {listing.Display_Resolution}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Storage</h3>
                <p className="text-gray-900">
                  {listing.Storage.map((s: any, i: number) => (
                    <span key={i}>
                      {s.size}GB {s.type}{i < listing.Storage.length - 1 ? ' + ' : ''}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">OS</h3>
                <p className="text-gray-900">{listing.OS}</p>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
