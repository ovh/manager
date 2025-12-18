import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@ovhcloud/ods-react';
import { useNashaList } from '@/hooks/nasha/useNasha';
import { urls } from '@/routes/Routes.constants';

/**
 * Root redirect component that checks if there are NASHA services
 * and redirects to the appropriate page:
 * - If there are services: redirect to listing
 * - If there are no services: redirect to onboarding
 * 
 * This matches the Angular behavior in nasha.routing.js
 */
export default function RootRedirect() {
  const { data: nashaList, isLoading, isError } = useNashaList();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // If there's an error or no data, default to listing
  if (isError || !nashaList) {
    return <Navigate to={urls.listing} replace />;
  }

  // Redirect based on whether there are NASHA services
  if (nashaList.length > 0) {
    return <Navigate to={urls.listing} replace />;
  }

  return <Navigate to={urls.onboarding} replace />;
}

