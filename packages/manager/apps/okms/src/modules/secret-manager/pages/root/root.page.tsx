import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useOkmsList } from '@/data/hooks/useOkms';
import Loading from '@/components/Loading/Loading';

export default function SecretManagerRootPage() {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  const { data, isPending } = useOkmsList({ pageSize: 1 });
  const firstKmsId = data?.pages[0]?.data?.[0]?.id;

  // If firstKmsId is available, navigate to the secret listing page
  // Otherwise, navigate to the onboarding page
  useEffect(() => {
    // Prevent navigation if already navigated or if still pending
    if (hasNavigated.current || isPending) {
      return;
    }
    if (firstKmsId) {
      navigate(SECRET_MANAGER_ROUTES_URLS.secretListing(firstKmsId), {
        replace: true,
      });
    } else {
      navigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding, {
        replace: true,
      });
    }
    hasNavigated.current = true;
  }, [firstKmsId, isPending, navigate]);

  return <Loading />;
}
