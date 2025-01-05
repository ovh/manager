import { v6 } from '@ovh-ux/manager-core-api';
import { RX_PLAN_CODE_PATTERN } from '@/constants';

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
  const { data: options } = await v6.get<TServiceOption[]>(url);
  return options
    .filter((option) => option.family === 'quota')
    .sort((a, b) => {
      return (
        parseInt(RX_PLAN_CODE_PATTERN.exec(a.planCode)[1], 10) -
        parseInt(RX_PLAN_CODE_PATTERN.exec(b.planCode)[1], 10)
      );
    });
};
