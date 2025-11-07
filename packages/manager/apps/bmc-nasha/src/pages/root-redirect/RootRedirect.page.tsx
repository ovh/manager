import { useEffect } from 'react';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Spinner } from '@ovh-ux/muk';

import { useHasNashaServices } from '@/hooks/listing/useHasNashaServices';
import { urls } from '@/routes/Routes.constants';

const LOADING_TIMEOUT = 3000; // 3 seconds timeout - redirect to onboarding if API doesn't respond

/**
 * RootRedirect component handles conditional redirection from "/" route.
 * If NASHA services exist, redirects to listing page.
 * Otherwise, redirects to onboarding page.
 * This replicates the AngularJS redirectTo logic from nasha.routing.js
 */
export default function RootRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasServices, isLoading, isError } = useHasNashaServices();

  // Handle /paas/nasha → /nasha redirection
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/paas/nasha')) {
      const newPath = currentPath.replace('/paas/nasha', '/nasha');
      window.location.href = window.location.href.replace(
        window.location.pathname,
        newPath,
      );
    }
  }, []);

  // Timeout fallback: if loading takes too long, redirect to onboarding
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        navigate('onboarding', { replace: true });
      }, LOADING_TIMEOUT);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoading, navigate]);

  // Handle error: redirect to onboarding
  useEffect(() => {
    if (isError) {
      navigate('onboarding', { replace: true });
    }
  }, [isError, navigate]);

  // Handle successful response: redirect based on hasServices
  useEffect(() => {
    if (!isLoading && !isError) {
      if (hasServices) {
        navigate(urls.listing, { replace: true });
      } else {
        navigate('onboarding', { replace: true });
      }
    }
  }, [hasServices, isLoading, isError, navigate]);

  // If we're at the root path "/", redirect to urls.root first
  if (location.pathname === '/') {
    return <Navigate to={urls.root} replace />;
  }

  // Show loading state while checking for services
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}

