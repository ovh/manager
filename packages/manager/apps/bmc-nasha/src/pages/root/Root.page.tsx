import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useNashaServicesCheck } from '@/hooks/useNashaServicesCheck';
import { urls } from '@/routes/Routes.constants';

/**
 * Root page that redirects based on whether user has NASHA services
 * Equivalent to the redirectTo logic in nasha.routing.js
 * - If services exist → redirect to listing
 * - If no services → redirect to onboarding
 */
export default function RootPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useNashaServicesCheck();

  useEffect(() => {
    if (!isLoading && data) {
      if (data.hasServices) {
        navigate(urls.listing, { replace: true });
      } else {
        navigate('onboarding', { replace: true });
      }
    }
  }, [data, isLoading, navigate]);

  // Show nothing while checking (or a loading spinner if desired)
  return null;
}



