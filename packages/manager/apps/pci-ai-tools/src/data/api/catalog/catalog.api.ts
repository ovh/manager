import { apiClient } from '@ovh-ux/manager-core-api';
import catalog from '@/types/Catalog';

export const catalogApi = {
  getCatalog: async (subsidiary = 'FR', productName = 'cloud') =>
    apiClient.v6
      .get(
        `/order/catalog/public/cloud?ovhSubsidiary=${subsidiary}&productName=${productName}`,
      )
      .then((res) => res.data as catalog.Catalog[]),
};
