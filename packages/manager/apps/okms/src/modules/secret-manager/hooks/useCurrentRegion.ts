import { useParams } from 'react-router-dom';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { OKMS } from '@/types/okms.type';

/**
 * Custom hook to determine the current region based on the URL parameters.
 * It checks for a okms ID and retrieves the corresponding region from the provided okms list.
 * If no okms ID is found, it checks for a region parameter.
 * If neither is found, it returns undefined.
 */
export const useCurrentRegion = (okmsList: OKMS[]) => {
  const { okmsId, region } = useParams<LocationPathParams>();

  if (!region && okmsList.length === 0) {
    return undefined;
  }

  if (okmsId) {
    const currentOkms = okmsList.find((okms) => okms.id === okmsId);
    if (currentOkms) {
      return currentOkms.region;
    }
  }

  if (region) {
    return region;
  }

  return undefined;
};
