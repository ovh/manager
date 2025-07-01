import { v6 } from '@ovh-ux/manager-core-api';
import {
  TInstanceDetailDto,
  TInstanceDto,
  TRetrieveInstancesQueryParams,
} from '@/types/instance/api.type';

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

const instanceUrl = (projectId: string, instanceId: string) =>
  `/cloud/project/${projectId}/instance/${instanceId}`;

const instanceActionUrl = (
  projectId: string,
  instanceId: string,
  action: TInstanceAction,
): string => {
  const basePathname = instanceUrl(projectId, instanceId);
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
}: {
  projectId: string;
  instanceId: string;
  snapshotName: string;
}): Promise<null> =>
  v6.post(instanceActionUrl(projectId, instanceId, 'snapshot'), {
    snapshotName,
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

/** @deprecated use regionalized getRegionInstance call instead */
export const getInstance = ({
  projectId,
  instanceId,
}: {
  projectId: string;
  instanceId: string;
}): Promise<TInstanceDto> =>
  v6
    .get(`/cloud/project/${projectId}/aggregated/instance/${instanceId}`)
    .then((response) => response.data);

export const getRegionInstance = ({
  projectId,
  region,
  instanceId,
}: {
  projectId: string;
  region: string;
  instanceId: string;
}): Promise<TInstanceDetailDto> =>
  v6
    .get(`/cloud/project/${projectId}/region/${region}/instance/${instanceId}`)
    .then((response) => response.data);

export const editInstanceName = ({
  projectId,
  instanceId,
  instanceName,
}: {
  projectId: string;
  instanceId: string;
  instanceName: string;
}): Promise<TInstanceDto> =>
  v6.put(instanceUrl(projectId, instanceId), {
    instanceName,
  });
