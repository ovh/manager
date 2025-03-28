import { TAddonRegions } from '@/types/region.type';

export const filterByHourlyAddons = (addons: TAddonRegions) =>
  addons.filter((addon) =>
    addon.pricings?.find(({ intervalUnit }) =>
      ['none', 'hour'].includes(intervalUnit),
    ),
  );

const SIZE_ORDER = ['s', 'm', 'l', 'xl', '2xl'];

export const sortProductBySize = (
  products: Array<{
    product: string;
    pricings: Array<{ price: number }>;
    blobs?: { technical?: { name: string } };
  }>,
) =>
  products
    .map(({ product, pricings, blobs }) => ({
      size: product.split('-').pop(),
      price: pricings[0].price,
      technicalName: blobs?.technical?.name,
    }))
    .sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size));
