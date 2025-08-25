import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { groupDomainsByRegion } from '@secret-manager/utils/domains';
import { useOkmsList } from '@/data/hooks/useOkms';
import Loading from '@/components/Loading/Loading';

export default function SecretManagerRootPage() {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  const { data, isPending } = useOkmsList();
  const okmsList = data || [];

  const handleNavigate = (url: string) => {
    navigate(url, { replace: true });
    hasNavigated.current = true;
  };

  // Manage redirect logic
  useEffect(() => {
    // Prevent navigation if already navigated or if still pending
    if (hasNavigated.current || isPending) {
      return;
    }

    // If no OKMS are available, navigate to the onboarding page
    if (okmsList.length === 0) {
      handleNavigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding);
      return;
    }

    const groupedOkms = Object.values(groupDomainsByRegion(okmsList));
    const firstRegionOkmsList = groupedOkms[0];
    const firstRegionOkms = firstRegionOkmsList[0];

    if (firstRegionOkmsList.length > 0) {
      if (firstRegionOkmsList.length === 1) {
        // If there is only one OKMS in the first region, navigate to the secret listing
        handleNavigate(
          SECRET_MANAGER_ROUTES_URLS.secretListing(firstRegionOkms.id),
        );
      } else {
        // If there are multiple OKMS in the first region, navigate to the domains list
        handleNavigate(
          SECRET_MANAGER_ROUTES_URLS.secretDomains(firstRegionOkms.region),
        );
      }
    }
  }, [okmsList, isPending, navigate]);

  return <Loading />;
}
