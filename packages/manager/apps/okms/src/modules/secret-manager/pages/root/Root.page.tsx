import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { groupOkmsListByRegion } from '@secret-manager/utils/okms';
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
      handleNavigate(SECRET_MANAGER_ROUTES_URLS.onboarding);
      return;
    }

    const groupedOkms = Object.values(groupOkmsListByRegion(okmsList));
    const firstRegionOkmsList = groupedOkms[0];
    const firstRegionOkms = firstRegionOkmsList[0];

    if (firstRegionOkmsList.length > 0) {
      if (firstRegionOkmsList.length === 1) {
        // If there is only one OKMS in the first region, navigate to the secret list page
        handleNavigate(
          SECRET_MANAGER_ROUTES_URLS.secretList(firstRegionOkms.id),
        );
      } else {
        // If there are multiple OKMS in the first region, navigate to the okms list page
        handleNavigate(
          SECRET_MANAGER_ROUTES_URLS.okmsList(firstRegionOkms.region),
        );
      }
    }
  }, [okmsList, isPending, navigate]);

  return <Loading />;
}
