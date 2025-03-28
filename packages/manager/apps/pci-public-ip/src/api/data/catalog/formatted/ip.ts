import { v6 } from '@ovh-ux/manager-core-api';
import { TFailoverIpCatalog } from '@/types/catalog.type';

export const getIpCatalogUrl = (ovhSubsidiary: string) =>
  `/order/catalog/formatted/ip?ovhSubsidiary=${ovhSubsidiary}&productName=ip-failover`;

export const getIpCatalog = async (
  ovhSubsidiary: string,
): Promise<TFailoverIpCatalog> => {
  const { data } = await v6.get<TFailoverIpCatalog>(
    getIpCatalogUrl(ovhSubsidiary),
  );
  return data;
};
