/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-pci-common
 */
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
type TRegionService = {
  endpoint: string;
  name: string;
  status: string;
};

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type TRegion = {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
  ipCountries: string[];
  services: TRegionService[];
};

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useProjectLocalRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions', 'local'],
    queryFn: () => getProjectRegions(projectId),
    select: (regions) =>
      regions.filter(({ type = [] }) => type === 'localzone'),
  });

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useProjectNonLocalRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions', 'non-local'],
    queryFn: () => getProjectRegions(projectId),
    select: (regions) =>
      regions.filter(({ type = [] }) => type !== 'localzone'),
  });
