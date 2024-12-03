import { v6 } from '@ovh-ux/manager-core-api';
import {
  TInstanceDto,
  TRetrieveInstancesQueryParams,
} from '@/types/instance/api.types';

type TInstanceAction = 'delete' | 'stop' | 'start' | 'shelve' | 'unshelve';

const instanceActionUrl = (
  projectId: string,
  instanceId: string,
  action: TInstanceAction,
): string => {
  const basePathname = `/cloud/project/${projectId}/instance/${instanceId}`;
  return action === 'delete' ? basePathname : `${basePathname}/${action}`;
};

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
  v6.delete(instanceActionUrl(projectId, instanceId, 'delete'));

export const stopInstance = (
  projectId: string,
  instanceId: string,
): Promise<null> => v6.post(instanceActionUrl(projectId, instanceId, 'stop'));

export const startInstance = (
  projectId: string,
  instanceId: string,
): Promise<null> => v6.post(instanceActionUrl(projectId, instanceId, 'start'));

export const shelveInstance = (
  projectId: string,
  instanceId: string,
): Promise<null> => v6.post(instanceActionUrl(projectId, instanceId, 'shelve'));

export const unshelveInstance = (
  projectId: string,
  instanceId: string,
): Promise<null> =>
  v6.post(instanceActionUrl(projectId, instanceId, 'unshelve'));
