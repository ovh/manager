import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import Loading from '@/components/Loading/Loading';

// Auto redirect to key management service list

export default function OkmsRootPage() {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Prevent navigating twice
    if (hasNavigated.current) {
      return;
    }

    navigate(KMS_ROUTES_URLS.kmsListing, { replace: true });
    hasNavigated.current = true;
  }, [navigate]);

  return <Loading />;
}
