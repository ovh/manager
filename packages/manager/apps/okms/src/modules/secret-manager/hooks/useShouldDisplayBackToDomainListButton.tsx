import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { filterDomainsByRegion } from '@secret-manager/utils/domains';
import { useOkmsList } from '@/data/hooks/useOkms';

export const useShouldDisplayBackToDomainListButton = (): boolean => {
  // get all domains
  const { data: OkmsList, isPending, error } = useOkmsList();

  // get current domain's region
  const currentRegionId = useCurrentRegion(OkmsList || []);

  // filter all domain by current domain's
  const regionOkmsList =
    OkmsList && currentRegionId
      ? filterDomainsByRegion(OkmsList, currentRegionId)
      : [];

  // if the okms list request is pending or in error, we should not display the button.
  if (error || isPending) {
    return false;
  }

  // if there's more than one domain on a region, we should display the back to domain list button
  return regionOkmsList.length > 1;
};
