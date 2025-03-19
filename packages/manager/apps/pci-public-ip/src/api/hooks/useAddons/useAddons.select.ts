import { TProductAddonDetail } from '@/types/product.type';

export const sortProductByPrice = (products: TProductAddonDetail[]) =>
  products.slice().sort((a, b) => a.price - b.price);
