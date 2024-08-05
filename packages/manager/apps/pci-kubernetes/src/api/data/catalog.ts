import { v6 } from '@ovh-ux/manager-core-api';

export type TCatalog = {
  addons: {
    planCode: string;
    blobs?: {
      tags: string[];
    };
  }[];
};

export const getCatalog = async (ovhSubsidiary: string): Promise<TCatalog> => {
  const { data } = await v6.get<TCatalog>(
    `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}`,
  );
  return data;
};
