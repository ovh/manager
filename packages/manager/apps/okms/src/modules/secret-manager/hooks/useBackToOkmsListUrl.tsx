import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { filterOkmsListByRegion } from '@secret-manager/utils/okms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useOkmsList } from '@/data/hooks/useOkms';

export const useBackToOkmsListUrl = () => {
  let okmsListUrl = null;

  const { data: OkmsList } = useOkmsList();

  const currentRegionId = useCurrentRegion(OkmsList || []);

  const regionOkmsList =
    OkmsList && currentRegionId
      ? filterOkmsListByRegion(OkmsList, currentRegionId)
      : [];

  // if there's more than one okms on a region, we set the url
  if (regionOkmsList.length > 1) {
    okmsListUrl = SECRET_MANAGER_ROUTES_URLS.okmsList(currentRegionId);
  }

  return okmsListUrl;
};
