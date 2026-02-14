import { v6 } from '@ovh-ux/manager-core-api';

import { CreditDetailsResponse, TStartupProgram } from '@/data/models/Credit.type';

type FetchResultV6<T> = {
  data: T[];
};

export const getCreditDetails = async (
  projectId: string,
): Promise<FetchResultV6<CreditDetailsResponse>> => {
  try {
    const headers: Record<string, string> = {
      'x-pagination-mode': 'CachedObjectList-Pages',
    };

    const response = await v6.get<CreditDetailsResponse[]>(`/cloud/project/${projectId}/credit`, {
      headers,
    });

    return {
      data: response.data,
    };
  } catch {
    return {
      data: [],
    };
  }
};

export const getCreditBalance = async (): Promise<string[]> => {
  const { data } = await v6.get<string[]>('/me/credit/balance');
  return data;
};

export const getStartupProgram = async (): Promise<TStartupProgram> => {
  const { data } = await v6.get<TStartupProgram>('/me/credit/balance/STARTUP_PROGRAM');
  return data;
};

export const isVoucherUsed = async (projectId: string, voucher: string): Promise<boolean> => {
  const response = await getCreditDetails(projectId);
  return (
    (response.data || []).filter((creditDetail: CreditDetailsResponse) => {
      return creditDetail.voucher === voucher;
    }).length === 0
  );
};
