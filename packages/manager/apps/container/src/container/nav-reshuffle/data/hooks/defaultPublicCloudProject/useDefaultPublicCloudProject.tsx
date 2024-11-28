import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { getDefaultPublicCloudProjectId } from '@/container/nav-reshuffle/data/api/defaultPublicCloudProject';

export const useDefaultPublicCloudProject = (options?: Partial<DefinedInitialDataOptions>) =>
  useQuery<string | null>({
    ...options,
    queryKey: ['default-pci-project'],
    queryFn: getDefaultPublicCloudProjectId,
    retry: false,
  });
