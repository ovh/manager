import { apiClient } from '@ovh-ux/manager-core-api';
import { order } from '@/types/catalog';

export const catalogApi = {
  getCatalog: async (subsidiary = 'FR', productName = 'cloud') =>
    apiClient.v6
      .get(
        `/order/catalog/public/cloud?ovhSubsidiary=${subsidiary}&productName=${productName}`,
      )
      .then((res) => res.data as order.publicOrder.Catalog[]),
};
