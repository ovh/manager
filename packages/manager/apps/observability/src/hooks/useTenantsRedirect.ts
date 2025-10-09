import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenants } from '@/data/hooks/tenants/useTenants';
import { urls } from '@/routes/Routes.constants';

export const useTenantsRedirect = () => {
  const {
    selectedService,
    isSuccess: isSuccessService,
    services,
  } = useObservabilityServiceContext();
  const navigate = useNavigate();

  const {
    data: tenants,
    isLoading,
    isSuccess: isSuccessTenants,
    isPending,
  } = useTenants(selectedService || '');

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
    if (isSuccess) {
      redirect();
    }
  }, [hasNoTenants, hasNoServices, isSuccess, navigate]);

  return {
    hasNoTenants,
    hasNoServices,
    isLoading,
    isPending,
  };
};
