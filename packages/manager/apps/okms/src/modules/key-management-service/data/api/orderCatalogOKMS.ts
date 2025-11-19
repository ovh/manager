import { OKMSCatalog } from '@key-management-service/types/orderCatalogOKMS.type';

import apiClient from '@ovh-ux/manager-core-api';

export const getOrderCatalogOKMS = async (ovhSubsidiary: string): Promise<OKMSCatalog> => {
  const { data } = await apiClient.v6.get<OKMSCatalog>('/order/catalog/public/okms', {
    params: { ovhSubsidiary },
  });
  return data;
};
