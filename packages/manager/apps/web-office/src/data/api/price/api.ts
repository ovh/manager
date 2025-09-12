import { v6 } from '@ovh-ux/manager-core-api';

import { PriceType } from './type';

// GET

export const getOfficePrice = async ({ officeName }: { officeName: string }) => {
  const { data } = await v6.get<PriceType>(`/price/license/office/${officeName}`);
  return data;
};
