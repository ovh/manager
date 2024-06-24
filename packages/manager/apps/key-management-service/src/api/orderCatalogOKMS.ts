import apiClient from '@ovh-ux/manager-core-api';
import { OKMSCatalog } from '@/types/orderCatalogOKMS.interface';

export const getOrderCatalogOKMS = async (
  ovhSubsidiary: string,
): Promise<OKMSCatalog> => {
  const { data } = await apiClient.v6.get<OKMSCatalog>(
    `/order/catalog/public/okms?ovhSubsidiary=${ovhSubsidiary}`,
  );
  return data;
};
