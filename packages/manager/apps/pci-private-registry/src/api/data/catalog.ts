import { v6 } from '@ovh-ux/manager-core-api';
import { TCapability } from '@/api/data/capability';

export type TCatalog = {
  addons: [
    {
      planCode: string;
      blobs: {
        technical: {
          bandwidth: {
            unlimited: boolean;
          };
        };
      };
      pricings: [
        {
          price: number;
          tax: number;
        },
      ];
    },
  ];
};

export const getCatalog = async (ovhSubsidiary: string): Promise<TCatalog> => {
  const { data } = await v6.get<TCatalog>(
    `order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}`,
  );

  return data;
};
