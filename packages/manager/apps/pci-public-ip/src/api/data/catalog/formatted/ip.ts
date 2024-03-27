import { v6 } from '@ovh-ux/manager-core-api';

export type TFormattedCatalog = {
  plans: {
    planCode: string;
    invoiceName: string;
  }[];
};

export const getIpCatalogUrl = (ovhSubsidiary: string) =>
  `/order/catalog/formatted/ip?ovhSubsidiary=${ovhSubsidiary}&productName=ip-failover`;
export const getIpCatalog = async (
  ovhSubsidiary: string,
): Promise<TFormattedCatalog> => {
  const { data } = await v6.get<TFormattedCatalog>(
    getIpCatalogUrl(ovhSubsidiary),
  );
  return data;
};
