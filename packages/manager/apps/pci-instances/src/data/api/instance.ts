import { v6 } from '@ovh-ux/manager-core-api';
import {
  TInstanceDetailDto,
  TInstanceDto,
  TNetworkAttachedToInstanceDto,
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

// TODO: remove this mock function when api is ready
export const getRegionInstanceMock = ({
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
    .then(({ data }) => ({
      ...data,
      id: '23372ac7-4144-4352-bafa-45a8a48137ac',
      regionType: 'region',
      image: {
        id: data.imageId,
        name: 'image-name',
        deprecated: false,
      },
      flavor: {
        id: data.flavorId,
        name: data.flavorName,
        specs: {
          cpu: 32,
          ram: 128000,
          storage: 400,
          bandwidth: {
            public: 20000,
            private: 20000,
          },
        },
      },
      addresses: [
        {
          ip: '10.3.1.17',
          version: 4,
          type: 'private',
          subnet: {
            name: 'monsubnet5',
            id: 'e09dbf37-664e-4286-a829-ba26e46d9ede',
            gatewayIP: '10.3.0.1',
            network: {
              id: 'b444f6e4-df5e-483c-b037-b61b36b8137e',
              name: 'monnetworkprive',
            },
          },
        },
        {
          ip: '15.235.69.65',
          version: 4,
          type: 'public',
          subnet: {
            name: 'Ext-Net',
            id: '63185a5f-5ed7-4778-8232-cfcd08737a7b',
            gatewayIP: '15.235.68.1',
            network: {
              id: '1cd75937-a054-4f11-8ecd-acce164a38be',
              name: 'Ext-Net',
            },
          },
        },
        {
          ip: '2607:5300:205:600::26e',
          version: 6,
          type: 'public',
          subnet: {
            name: 'Ext-Net',
            id: '144d324b-f21c-465e-be0a-7d953fcabc99',
            gatewayIP: '2607:5300:205:600::',
            network: {
              id: '1cd75937-a054-4f11-8ecd-acce164a38be',
              name: 'Ext-Net',
            },
          },
        },
      ],
      actions: [
        {
          name: 'details',
          group: 'details',
        },
        {
          name: 'edit',
          group: 'details',
        },
        {
          name: 'assign_floating_ip',
          group: 'details',
        },
        {
          name: 'create_backup',
          group: 'details',
        },
        {
          name: 'create_autobackup',
          group: 'details',
        },
        {
          name: 'stop',
          group: 'lifecycle',
        },
        {
          name: 'rescue',
          group: 'boot',
        },
        {
          name: 'soft_reboot',
          group: 'boot',
        },
        {
          name: 'hard_reboot',
          group: 'boot',
        },
        {
          name: 'shelve',
          group: 'shelve',
        },
        {
          name: 'reinstall',
          group: 'delete',
        },
        {
          name: 'delete',
          group: 'delete',
        },
      ],
      prices: [
        {
          type: 'hour',
          value: 297561000,
          status: 'enabled',
        },
      ],
      volumes: [
        {
          id: '4889596a-0b81-4757-89f9-200ce2ac6539',
          name: 'testVolume1',
        },
        {
          id: '82003196-51c8-4602-9847-3caaea2a12d2',
          name: 'testVOlume2',
        },
      ],
      login: 'ssh almalinux@51.161.81.152',
    }));

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

export const attachNetworkToInstance = ({
  projectId,
  instanceId,
  networkId,
}: {
  projectId: string;
  instanceId: string;
  networkId: string;
}): Promise<TNetworkAttachedToInstanceDto> =>
  v6.post(`/cloud/project/${projectId}/instance/${instanceId}/interface`, {
    networkId,
  });
