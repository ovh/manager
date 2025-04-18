import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { getDefaultPublicCloudProjectId } from '@/container/nav-reshuffle/data/api/defaultPublicCloudProject';
import { PciProject } from '@/container/nav-reshuffle/sidebar/ProjectSelector/PciProject';

export const useDefaultPublicCloudProject = (
  options?: Partial<
    DefinedInitialDataOptions<string | null, unknown, PciProject>
  >,
) =>
  useQuery({
    ...options,
    queryKey: ['default-pci-project'],
    queryFn: getDefaultPublicCloudProjectId,
    retry: false,
  });
