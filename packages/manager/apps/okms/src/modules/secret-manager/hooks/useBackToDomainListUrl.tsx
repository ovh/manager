import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { filterDomainsByRegion } from '@secret-manager/utils/domains';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useOkmsList } from '@/data/hooks/useOkms';

export const useBackToDomainListUrl = () => {
  let domainListUrl = null;

  // get all domains
  const { data: OkmsList } = useOkmsList();

  // get current domain's region
  const currentRegionId = useCurrentRegion(OkmsList || []);

  // filter all domain by current domain's
  const regionOkmsList =
    OkmsList && currentRegionId
      ? filterDomainsByRegion(OkmsList, currentRegionId)
      : [];

  // if there's more than one domain on a region, we set the url
  if (regionOkmsList.length > 1) {
    domainListUrl = SECRET_MANAGER_ROUTES_URLS.secretDomains(currentRegionId);
  }

  return domainListUrl;
};
