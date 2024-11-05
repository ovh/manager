import { v6 } from '@ovh-ux/manager-core-api';
import {
  TInstanceDto,
  TRetrieveInstancesQueryParams,
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
): Promise<null> =>
  v6.delete(`/cloud/project/${projectId}/instance/${instanceId}`);
