import { TRegion } from '@ovh-ux/manager-pci-common';
import { ALPHA_CHARACTERS_REGEX } from '@/constants';

export const getOpenRcApiVersion = (regions: TRegion[], region: string) => {
  const hasGlobalRegions = regions.some((r) =>
    ALPHA_CHARACTERS_REGEX.test(r.name),
  );
  // Returns v3 if the region list has global regions i.e, GRA, DE, etc
  return hasGlobalRegions || region === 'US' ? 3 : 2;
};
