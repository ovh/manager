import apiClient from '@ovh-ux/manager-core-api';
import { Location } from '@ovh-ux/shell';

import { Infrastructure, Retention } from '@/types/infrastructures.type';

import { InfrastructuresParams, RetentionParams } from './infrastructures.props';

export const getInfrastructures = async ({
  resourceName,
  usages,
  types,
  signal,
}: InfrastructuresParams): Promise<Infrastructure[]> => {
  const { data } = await apiClient.v2.get<Infrastructure[]>(
    `/observability/resource/${resourceName}/setting/infrastructure`,
    {
      signal,
      params: {
        usages,
        types,
      },
    },
  );
  return data;
};

export const getLocations = async (signal: AbortSignal): Promise<Location[]> => {
  const { data } = await apiClient.v2.get<Location[]>(`location`, {
    signal,
  });
  return data;
};

export const getRetentions = async ({
  resourceName,
  infrastructureId,
  retentionTypes,
  signal,
}: RetentionParams): Promise<Retention[]> => {
  const { data } = await apiClient.v2.get<Retention[]>(
    `/observability/resource/${resourceName}/setting/infrastructure/${infrastructureId}/retention`,
    {
      signal,
      params: {
        retentionTypes,
      },
    },
  );
  return data;
};
