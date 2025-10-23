import React, { Suspense } from 'react';

export default function ListingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nasha Services</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Listing Page</h2>
              <p className="text-gray-600">This is the main listing page for Nasha services.</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
