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

  // Manage redirect logic
  useEffect(() => {
    // Prevent navigation if already navigated or if still pending
    if (hasNavigated.current || isPending) {
      return;
    }

    // If no OKMS are available, navigate to the onboarding page
    let url = SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding;

    if (okmsList.length > 0) {
      const groupedOkms = Object.values(groupDomainsByRegion(okmsList));
      const firstRegionOkmsList = groupedOkms[0];
      const firstRegionOkms = firstRegionOkmsList[0];

      if (firstRegionOkmsList.length > 1) {
        // If there are multiple OKMS in the first region, navigate to the domains list
        url = SECRET_MANAGER_ROUTES_URLS.secretDomains(firstRegionOkms.region);
      } else {
        // If there is only one OKMS in the first region, navigate to the secret listing
        url = SECRET_MANAGER_ROUTES_URLS.secretListing(firstRegionOkms.id);
      }
    }

    navigate(url, { replace: true });
    hasNavigated.current = true;
  }, [okmsList, isPending, navigate]);

  return <Loading />;
}
