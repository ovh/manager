import { IamResourcesResponse } from '@/types/iam.type';
import { apiClient } from '@ovh-ux/manager-core-api';

export const getResource = async ({
  resourceURN,
  signal,
}: {
  resourceURN: string;
  signal?: AbortSignal;
}): Promise<IamResourcesResponse> => {
  const { data } = await apiClient.v2.get<IamResourcesResponse>(
    '/iam/resource',
    {
      signal,
      params: {
        resourceURN,
      },
    },
  );
  return data;
};
