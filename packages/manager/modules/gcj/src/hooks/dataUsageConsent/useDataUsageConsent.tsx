import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { TrackingPlugin } from '@ovh-ux/shell';
import { Region } from '@ovh-ux/manager-config';
import {
  WEBSITE_PRIVACY_COOKIE_NAME,
  WEBSITE_TRACKING_CONSENT_VALUE,
} from './useDataUsage.constants';

export const useDataUsageConsent = (
  region: Region,
  trackingPlugin: TrackingPlugin,
): {
  shouldRequestConsent: boolean;
  setConsent: (consent: boolean) => void;
} => {
  const [cookies, setCookies] = useCookies([WEBSITE_PRIVACY_COOKIE_NAME], {
    doNotParse: true,
  });
  const [shouldRequestConsent, setShouldRequestConsent] = useState(
    region !== 'US' && !cookies[WEBSITE_PRIVACY_COOKIE_NAME],
  );

  const setConsent = useCallback((consent: boolean) => {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 13);
    setCookies(
      WEBSITE_PRIVACY_COOKIE_NAME,
      consent ? WEBSITE_TRACKING_CONSENT_VALUE : null,
      {
        path: '/',
        expires: expirationDate,
      },
    );
    setShouldRequestConsent(false);
  }, []);

  useEffect(() => {
    if (shouldRequestConsent === false) {
      trackingPlugin.onUserConsentFromModal(
        cookies[WEBSITE_PRIVACY_COOKIE_NAME]?.includes(
          WEBSITE_TRACKING_CONSENT_VALUE,
        ) ?? false,
      );
    }
  }, [shouldRequestConsent]);

  return {
    shouldRequestConsent,
    setConsent,
  };
};
