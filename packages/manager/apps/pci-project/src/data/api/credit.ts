import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';

export interface CreditDetailsResponse {
  voucher: string | null;
  description: string;
  available_credit: {
    text: string;
    value: number;
  };
  validity?: {
    from: string;
    to: string;
  };
}

export const getCreditDetails = async (
  projectId: string,
): Promise<FetchResultV6<CreditDetailsResponse>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };

  return v6.get(`/cloud/project/${projectId}/credit`, { headers });
};
