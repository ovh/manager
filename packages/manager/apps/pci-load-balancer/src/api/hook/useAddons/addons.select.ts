import { TAddonRegions } from '@/types/region.type';

export const selectHourlyAddons = (addons: TAddonRegions) =>
  addons.filter((addon) =>
    addon.pricings?.find(({ intervalUnit }) =>
      ['none', 'hour'].includes(intervalUnit),
    ),
  );
