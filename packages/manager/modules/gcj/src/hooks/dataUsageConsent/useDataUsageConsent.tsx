import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { TrackingPlugin } from '@ovh-ux/shell';
import { Region } from '@ovh-ux/manager-config';

export const useDataUsageConsent = (
  region: Region,
  trackingPlugin: TrackingPlugin,
): {
  shouldRequestConsent: boolean;
  setConsent: (consent: boolean) => void;
} => {
  const [cookies, setCookies] = useCookies(['MANAGER_TRACKING'], {
    doNotParse: true,
  });
  const [shouldRequestConsent, setShouldRequestConsent] = useState(
    region !== 'US' && !cookies.MANAGER_TRACKING,
  );

  const setConsent = useCallback((consent: boolean) => {
    setCookies('MANAGER_TRACKING', consent ? 1 : 0);
    setShouldRequestConsent(false);
  }, []);

  useEffect(() => {
    if (shouldRequestConsent === false) {
      trackingPlugin.onUserConsentFromModal(cookies.MANAGER_TRACKING === '1');
    }
  }, [shouldRequestConsent]);

  return {
    shouldRequestConsent,
    setConsent,
  };
};
