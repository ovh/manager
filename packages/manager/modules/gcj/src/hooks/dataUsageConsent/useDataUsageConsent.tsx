/* eslint-disable check-file/folder-naming-convention */
import { useCallback, useEffect, useState } from 'react';

import { useCookies } from 'react-cookie';

import { Region } from '@ovh-ux/manager-config';
import { TrackingPlugin } from '@ovh-ux/shell';

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
  const privacyCookie = cookies[WEBSITE_PRIVACY_COOKIE_NAME] as string | undefined;

  const [shouldRequestConsent, setShouldRequestConsent] = useState(
    region !== Region.US && !privacyCookie,
  );

  const loadPianoAnalytics = () => import('piano-analytics-js/dist/browser/piano-analytics.js');

  const setConsent = useCallback((consent: boolean) => {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 13);
    setCookies(WEBSITE_PRIVACY_COOKIE_NAME, consent ? WEBSITE_TRACKING_CONSENT_VALUE : null, {
      path: '/',
      expires: expirationDate,
    });
    setShouldRequestConsent(false);
  }, []);

  useEffect(() => {
    if (shouldRequestConsent) return;

    const hasConsent = privacyCookie?.includes(WEBSITE_TRACKING_CONSENT_VALUE) ?? false;

    if (hasConsent || region === Region.US) {
      void loadPianoAnalytics().then(() => trackingPlugin.onUserConsentFromModal(true));
      return;
    }

    void trackingPlugin.onUserConsentFromModal(false);
  }, [shouldRequestConsent]);

  return {
    shouldRequestConsent,
    setConsent,
  };
};
