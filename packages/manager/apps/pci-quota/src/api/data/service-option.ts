import { v6 } from '@ovh-ux/manager-core-api';

export type TServiceOption = {
  exclusive: boolean;
  family: string;
  mandatory: boolean;
  planCode: string;
  prices: {
    capacities: string[];
    duration: string;
    pricingMode: string;
    price: {
      text: string;
    };
  }[];
  productName: string;
  productType: string;
};

export const getServiceOptions = async (
  projectId: string,
): Promise<TServiceOption[]> => {
  const url = `/order/cartServiceOption/cloud/${projectId}`;
  const { data } = await v6.get<TServiceOption[]>(url);
  return data;
};
