import { apiClient } from '@/data/api/api.client';
import { order } from '@/types/catalog';

export const catalogApi = {
  getCatalog: async (subsidiary = 'FR', productName = 'cloud') =>
    apiClient.v6.get<order.publicOrder.Catalog>(
      `/order/catalog/public/cloud?ovhSubsidiary=${subsidiary}&productName=${productName}`,
    ),
};
