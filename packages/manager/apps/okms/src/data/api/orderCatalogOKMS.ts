import apiClient from '@ovh-ux/manager-core-api';
import { OKMSCatalog } from '@/types/orderCatalogOKMS.type';

export const getOrderCatalogOKMS = async (
  ovhSubsidiary: string,
): Promise<OKMSCatalog> => {
  const { data } = await apiClient.v6.get<OKMSCatalog>(
    '/order/catalog/public/okms',
    { params: { ovhSubsidiary } },
  );
  return data;
};
