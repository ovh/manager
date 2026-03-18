import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

import { Price, PricingType } from '../../../types';

export type CartServiceOptionPrice = {
  capacities: ('installation' | 'upgrade' | 'renew')[];
  description: string;
  duration: string;
  interval: number | null;
  maximumQuantity: number | null;
  maximumRepeat: number | null;
  minimumQuantity: number | null;
  minimumRepeat: number | null;
  price: Price;
  priceInUcents: number;
  pricingMode: string;
  pricingType: PricingType;
};

export type CartServiceOption = {
  exclusive: boolean;
  family: string;
  mandatory: boolean;
  planCode: string;
  prices: CartServiceOptionPrice[];
  productName: string;
  productType: string;
};

export const getCartServiceOption = ({
  serviceName,
  resourceType,
}: {
  serviceName: string;
  resourceType: string;
}): Promise<ApiResponse<CartServiceOption[]>> =>
  v6.get<CartServiceOption[]>(
    `/order/cartServiceOption/${resourceType}/${serviceName}`,
  );
