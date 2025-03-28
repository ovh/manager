import { TProductAddonDetail } from '@/types/product.type';

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
