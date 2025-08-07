/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * The hooks will be available in the `@ovh-ux/manager-pci-common` package.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

/**
 * @deprecated The interface is deprecated and will be removed in MRC V3.
 */
export interface Region {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
}

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getProjectRegionsQueryKey = (projectId: string) => [
  'project',
  projectId,
  'regions',
];

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getProjectRegions = async (
  projectId: string,
): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: getProjectRegionsQueryKey(projectId),
    queryFn: () => getProjectRegions(projectId),
  });
