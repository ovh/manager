import { useParams } from 'react-router-dom';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { OKMS } from '@/types/okms.type';

/**
 * Custom hook to determine the current region based on the URL parameters.
 * It checks for a domain ID and retrieves the corresponding region from the provided domains.
 * If no domain ID is found, it checks for a region parameter.
 * If neither is found, it returns undefined.
 */
export const useCurrentRegion = (domains: OKMS[]) => {
  const { domainId, region } = useParams<LocationPathParams>();

  if (domainId) {
    const currentDomain = domains.find((domain) => domain.id === domainId);
    if (currentDomain) {
      return currentDomain.region;
    }
  }

  if (region) {
    return region;
  }

  return undefined;
};
