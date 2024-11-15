import { v6 } from '@ovh-ux/manager-core-api';
import {
  TDeleteInstanceDto,
  TInstanceDto,
  TRetrieveInstancesQueryParams,
  TStartInstanceDto,
  TStopInstanceDto,
} from '@/types/instance/api.types';

export const getInstances = (
  projectId: string,
  {
    limit,
    sort,
    sortOrder,
    offset,
    searchField,
    searchValue,
  }: TRetrieveInstancesQueryParams,
): Promise<TInstanceDto[]> =>
  v6
    .get(`/cloud/project/${projectId}/aggregated/instance`, {
      params: {
        limit: limit + 1,
        sort,
        sortOrder,
        offset,
        searchField,
        searchValue,
      },
    })
    .then((response) => response.data);

export const deleteInstance = (
  projectId: string,
  instanceId: string,
): Promise<TDeleteInstanceDto> =>
  v6.delete(`/cloud/project/${projectId}/instance/${instanceId}`);

export const stopInstance = (
  projectId: string,
  instanceId: string,
): Promise<TStopInstanceDto> =>
  v6.post(`/cloud/project/${projectId}/instance/${instanceId}/stop`);

export const startInstance = (
  projectId: string,
  instanceId: string,
): Promise<TStartInstanceDto> =>
  v6.post(`/cloud/project/${projectId}/instance/${instanceId}/start`);
