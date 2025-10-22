import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import {
  CreditDetailsResponse,
  TStartupProgram,
} from '@/data/types/credit.type';

export const getCreditDetails = async (
  projectId: string,
): Promise<FetchResultV6<CreditDetailsResponse>> => {
  try {
    const headers: Record<string, string> = {
      'x-pagination-mode': 'CachedObjectList-Pages',
    };

    const response = await v6.get(`/cloud/project/${projectId}/credit`, {
      headers,
    });

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: [],
    };
  }
};

export const getCreditBalance = async (): Promise<string[]> => {
  const { data } = await v6.get('/me/credit/balance');
  return data;
};

export const getStartupProgram = async (): Promise<TStartupProgram> => {
  const { data } = await v6.get('/me/credit/balance/STARTUP_PROGRAM');
  return data;
};
