import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenants } from '@/data/hooks/tenants/useTenants.hook';
import { urls } from '@/routes/Routes.constants';

const redirectableUrls: string[] = [urls.tenants, urls.tenantsOnboarding, urls.onboarding];

const shouldRedirect = (pathname: string) => redirectableUrls.includes(pathname);

export const useTenantsRedirect = () => {
  const {
    selectedService,
    isSuccess: isSuccessService,
    services,
  } = useObservabilityServiceContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: tenants,
    isLoading,
    isSuccess: isSuccessTenants,
    isPending,
  } = useTenants(selectedService?.id || '');

  const isSuccess = isSuccessService && isSuccessTenants;

  const hasNoTenants = isSuccessTenants && (!tenants || tenants.length === 0);
  const hasNoServices = isSuccessService && (!services || services.length === 0);

  useEffect(() => {
    const redirect = () => {
      if (hasNoServices) {
        // Redirect to onboarding if no services exist
        navigate(urls.onboarding, {
          replace: true,
        });
      } else if (hasNoTenants) {
        // Redirect to onboarding if no tenants exist
        navigate(urls.tenantsOnboarding, { replace: true });
      } else {
        // redirect to tenants listing
        navigate(urls.tenants, { replace: true });
      }
    };

    // Only redirect when on the tenants route listing/onboarding
    if ((isSuccess || hasNoServices) && shouldRedirect(location.pathname)) {
      redirect();
    }
  }, [hasNoTenants, hasNoServices, isSuccess, navigate, location.pathname]);

  return {
    hasNoTenants,
    hasNoServices,
    isLoading,
    isPending,
  };
};
