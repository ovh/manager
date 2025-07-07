import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import {
  TAggregatedInstanceDto,
  TInstanceDto,
  TRetrieveInstancesQueryParams,
} from '@/types/instance/api.type';
import { mapDtoToInstance } from './mapper/instance.mapper';
import { TInstance } from '@/types/instance/entity.type';
import { DeepReadonly } from '@/types/utils.type';

type TInstanceAction =
  | 'delete'
  | 'stop'
  | 'start'
  | 'shelve'
  | 'unshelve'
  | 'reboot'
  | 'reinstall'
  | 'rescueMode'
  | 'snapshot'
  | 'activeMonthlyBilling';

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
): Promise<TAggregatedInstanceDto[]> =>
  v6
    .get<TAggregatedInstanceDto[]>(
      `/cloud/project/${projectId}/aggregated/instance`,
      {
        params: {
          limit: limit + 1,
          sort,
          sortOrder,
          offset,
          searchField,
          searchValue,
        },
      },
    )
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

export const rebootInstance = ({
  projectId,
  instanceId,
  rebootType,
}: {
  projectId: string;
  instanceId: string;
  rebootType: 'soft' | 'hard';
}): Promise<null> =>
  v6.post(instanceActionUrl(projectId, instanceId, 'reboot'), {
    type: rebootType,
  });

export const rescueMode = ({
  projectId,
  instanceId,
  imageId,
  isRescue,
}: {
  projectId: string;
  instanceId: string;
  imageId: string;
  isRescue: boolean;
}): Promise<null> =>
  v6.post(instanceActionUrl(projectId, instanceId, 'rescueMode'), {
    imageId,
    instanceId,
    rescue: isRescue,
  });

export const backupInstance = ({
  projectId,
  instanceId,
  snapshotName,
  distantSnapshotName,
  distantRegionName,
}: {
  projectId: string;
  instanceId: string;
  snapshotName: string;
  distantSnapshotName?: string;
  distantRegionName?: string;
}): Promise<null> =>
  v6.post(instanceActionUrl(projectId, instanceId, 'snapshot'), {
    snapshotName,
    distantSnapshotName,
    distantRegionName,
  });

export const reinstallInstance = (
  projectId: string,
  instanceId: string,
  imageId: string,
): Promise<null> =>
  v6.post(instanceActionUrl(projectId, instanceId, 'reinstall'), {
    imageId,
  });

export const activateMonthlyBilling = (
  projectId: string,
  instanceId: string,
): Promise<null> =>
  v6.post(instanceActionUrl(projectId, instanceId, 'activeMonthlyBilling'), {
    instanceId, // TODO: Works well and ISO prod but need to check if we really need this to not send useless data
    serviceName: projectId,
  });

export type TGetInstanceQueryParams = Array<
  'withVolumes' | 'withBackups' | 'withNetworks' | 'withImage'
>;

type TGetInstanceArgs = DeepReadonly<{
  projectId: string;
  instanceId: string;
  region: string | null;
  params?: TGetInstanceQueryParams;
}>;

export const getInstance = async ({
  projectId,
  region,
  instanceId,
  params,
}: TGetInstanceArgs): Promise<TInstance> =>
  v6
    .get(
      `/cloud/project/${projectId}/region/${region}/instance/${instanceId}`,
      {
        params: params?.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      },
    )
    .then((response: AxiosResponse<TInstanceDto>) =>
      mapDtoToInstance(response.data),
    );
