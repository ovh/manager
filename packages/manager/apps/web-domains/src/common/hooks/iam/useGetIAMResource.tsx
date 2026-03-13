import { useQuery } from '@tanstack/react-query';
import { IAMResource, getIAMResource } from '@/common/data/api/common.api';

export const useGetIAMResource = (
  resourceName: string | undefined,
  resourceType: string,
) => {
  return useQuery<IAMResource[], Error>({
    queryKey: ['iam', 'resource', resourceName, resourceType],
    queryFn: () => getIAMResource(resourceName ?? '', resourceType),
    enabled: !!resourceName,
  });
};
