import React from 'react';

import { Navigate } from 'react-router-dom';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { useNashaServices } from '@/data/api/hooks/useNashaServices';
import { urls } from '@/routes/Routes.constants';

export default function LandingRedirect() {
  const { data, isLoading, error } = useNashaServices({
    page: 1,
    pageSize: 1, // Only need to check if any services exist
  });

  // Show loading spinner while checking for services
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <OdsSpinner />
      </div>
    );
  }

  // If there's an error, redirect to listing (let the listing page handle the error)
  if (error) {
    return <Navigate to={urls.listing} replace />;
  }

  // If no services exist, redirect to onboarding
  if (!data?.data || data.data.length === 0) {
    return <Navigate to={urls.onboarding} replace />;
  }

  // If services exist, redirect to listing
  return <Navigate to={urls.listing} replace />;
}

