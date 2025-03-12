import { aapi } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import { Bills, BillsCapsule } from '@/types/bills.type';

export const getBills: (period: number) => Promise<Bills> = async (
  period: number,
) => {
  const { data }: AxiosResponse<BillsCapsule> = await aapi.get<BillsCapsule>(
    `/hub/bills`,
    {
      params: {
        billingPeriod: period,
      },
    },
  );
  return data.data?.bills?.data;
};
