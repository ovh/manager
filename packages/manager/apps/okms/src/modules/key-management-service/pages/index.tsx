import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@key-management-service/components/Loading/Loading';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';

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
