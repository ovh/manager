import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { filterOkmsListByRegion } from '@secret-manager/utils/okms';

export const useBackToOkmsListUrl = () => {
  let okmsListUrl = null;

  const { data: OkmsList } = useOkmsList();

  const currentRegionId = useCurrentRegion(OkmsList || []);

  const regionOkmsList =
    OkmsList && currentRegionId ? filterOkmsListByRegion(OkmsList, currentRegionId) : [];

  // if there's more than one okms on a region, we set the url
  if (currentRegionId && regionOkmsList.length > 1) {
    okmsListUrl = SECRET_MANAGER_ROUTES_URLS.okmsList(currentRegionId);
  }

  return okmsListUrl;
};
