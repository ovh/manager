import { AxiosResponse } from 'axios';

import { v6 } from '@ovh-ux/manager-core-api';

import { Debt } from '@/types/debt.type';

export const getDebt: () => Promise<Debt> = async () => {
  const { data }: AxiosResponse<Debt> = await v6.get<Debt>(`/me/debtAccount`);
  return data;
};
