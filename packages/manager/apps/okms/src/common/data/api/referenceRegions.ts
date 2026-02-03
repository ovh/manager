import apiClient from '@ovh-ux/manager-core-api';

import { ReferenceRegion } from '@/common/types/referenceRegions.type';

export const referenceRegionsQueryKey = ['okms', 'reference', 'regions'];

export const getReferenceRegions = async (): Promise<ReferenceRegion[]> => {
  const { data } = await apiClient.v2.get<ReferenceRegion[]>(`okms/reference/regions`);
  return data;
};
