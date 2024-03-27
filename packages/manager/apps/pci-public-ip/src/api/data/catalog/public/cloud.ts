import { v6 } from '@ovh-ux/manager-core-api';

export type TCatalog = {
  addons: {
    product: string;
    planCode: string;
    pricings: { price: string }[];
  }[];
};

export const getCloudCatalogUrl = (ovhSubsidiary: string) =>
  `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}&productName=cloud`;

export const getCloudCatalog = async (
  ovhSubsidiary: string,
): Promise<TCatalog> => {
  const { data } = await v6.get<TCatalog>(getCloudCatalogUrl(ovhSubsidiary));
  return data;
};
