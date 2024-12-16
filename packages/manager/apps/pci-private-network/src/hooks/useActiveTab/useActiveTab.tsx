import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PrivateNetworkTabName } from '@/pages/listing/ListingLayout.constant';

export function useActiveTab() {
  const location = useLocation();

  return useMemo(
    () =>
      location.pathname.includes('localZone')
        ? PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME
        : PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME,
    [location],
  );
}
