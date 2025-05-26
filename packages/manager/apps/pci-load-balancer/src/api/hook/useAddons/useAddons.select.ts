import { TCatalog, TProductAvailability } from '@ovh-ux/manager-pci-common';
import { TProductAddonDetail } from '@/types/product.type';
import { TAddonRegions } from '@/types/region.type';

const SIZE_ORDER = ['s', 'm', 'l', 'xl', '2xl'];

export const sortProductByPrice = (products: TProductAddonDetail[]) =>
  products.slice().sort((a, b) => a.price - b.price);

export const filterProductRegionBySize = (
  products: TProductAddonDetail[],
  region: string,
) =>
  products
    .filter(({ regions }) => regions.some(({ name }) => name === region))
    .sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size));

export const getAddonsRegions = (
  plans: TProductAvailability['plans'],
  catalog?: TCatalog,
) =>
  plans.flatMap(({ code, regions }) => {
    const addon = catalog?.addons.find(({ planCode }) => code === planCode);
    return addon ? [{ ...addon, regions }] : [];
  });

export const getHourlyAddons = (addons: TAddonRegions) =>
  addons.filter((addon) =>
    addon.pricings.find(({ intervalUnit }) =>
      ['none', 'hour'].includes(intervalUnit),
    ),
  );
