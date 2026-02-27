import apiClient from '@ovh-ux/manager-core-api';
import { OvhSubsidiary } from '@ovh-ux/muk';
import { HYCUCatalog } from '@/types/orderCatalogHYCU.type';

/**
 * HYCU Catalog : Get HYCU Order Catalog
 */
export const getOrderCatalogHYCU = async (
  ovhSubsidiary: OvhSubsidiary,
): Promise<HYCUCatalog> => {
  const { data } = await apiClient.v6.get<HYCUCatalog>(
    `/order/catalog/public/licenseHycu?ovhSubsidiary=${ovhSubsidiary}`,
  );
  return data;
};
