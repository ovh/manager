import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { CreditDetailsResponse } from '@/data/types/credit.type';
import { TStartupProgram } from '../types/credit';

export const getCreditDetails = async (
  projectId: string,
): Promise<FetchResultV6<CreditDetailsResponse>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };

  return v6.get(`/cloud/project/${projectId}/credit`, { headers });
};

export const getCreditBalance = async (): Promise<string[]> => {
  const { data } = await v6.get('/me/credit/balance');
  return data;
};

export const getStartupProgram = async (): Promise<TStartupProgram> => {
  const { data } = await v6.get('/me/credit/balance/STARTUP_PROGRAM');
  return data;
};
