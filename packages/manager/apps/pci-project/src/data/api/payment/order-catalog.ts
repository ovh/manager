import { v6 } from '@ovh-ux/manager-core-api';
import { TOrderCatalog } from '@/data/types/payment/order-catalog.type';

export type TOrderCatalogParams = {
  ovhSubsidiary: string;
};

export const getOrderCatalog = async (
  params?: TOrderCatalogParams,
): Promise<TOrderCatalog | undefined> => {
  return v6.get(`/order/catalog/public/cloud`, { params }).then((d) => d?.data);
};
