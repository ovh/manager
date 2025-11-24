import apiClient from '@ovh-ux/manager-core-api';

import { OkmsCatalog } from '@/common/types/orderCatalogOkms.type';

export const getOrderCatalogOkms = async (ovhSubsidiary: string): Promise<OkmsCatalog> => {
  const { data } = await apiClient.v6.get<OkmsCatalog>('/order/catalog/public/okms', {
    params: { ovhSubsidiary },
  });
  return data;
};
