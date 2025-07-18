import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { CreditDetailsResponse } from '@/data/types/credit.type';

export const getCreditDetails = async (
  projectId: string,
): Promise<FetchResultV6<CreditDetailsResponse>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };

  return v6.get(`/cloud/project/${projectId}/credit`, { headers });
};
