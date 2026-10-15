import { useEffect, useState } from 'react';
import { cmp } from '@/cmp';

/** Regions served by the OVHcloud CMP (US has no CMP, different legal framework). */
export const CMP_REGIONS = ['EU', 'CA'];

/**
 * Whether a "Manage cookies" action can open the CMP preferences modal: only
 * in a CMP region, and only once the CMP is actually up. When it failed to
 * come up the legacy consent modal took over and there are no preferences
 * to open, so the action must not be offered.
 */
export const useCookiePreferencesAvailable = (region: string): boolean => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (!CMP_REGIONS.includes(region)) return undefined;
    let cancelled = false;
    cmp.whenReady().then(() => {
      if (!cancelled) setIsAvailable(!cmp.isError());
    });
    return () => {
      cancelled = true;
    };
  }, [region]);

  return isAvailable;
};

export default useCookiePreferencesAvailable;
