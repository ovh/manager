import order from '@/types/Order';
import { apiClient } from '../api.client';

export const catalogApi = {
  getCatalog: async (subsidiary = 'FR', productName = 'cloud') =>
    apiClient.v6.get<order.catalog._public.Catalog>(
      `/order/catalog/public/cloud?ovhSubsidiary=${subsidiary}&productName=${productName}`,
    ),
};
