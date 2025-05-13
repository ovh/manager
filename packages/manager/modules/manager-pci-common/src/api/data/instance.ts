import { v6 } from '@ovh-ux/manager-core-api';

export type TInstance = {
  created: string;
  currentMonthOutgoingTraffic?: number;
  flavorId: string;
  id: string;
  imageId: string;
  ipAddresses: {
    gatewayIp?: string;
    ip: string;
    networkId: string;
    type: string;
    version: number;
  }[];
  monthlyBilling?: {
    since: string;
    status: 'activationPending' | 'ok';
  };
  name: string;
  operationIds: string[];
  planCode: string;
  region: string;
  sshKeyId?: string;
  status: string;
};

export const getInstance = async (
  projectId: string,
  instanceId: string,
): Promise<TInstance> => {
  const { data } = await v6.get<TInstance>(
    `/cloud/project/${projectId}/instance/${instanceId}`,
  );
  return data;
};

/**
 * If possible use getInstancesByRegion instead
 */
export const getInstances = async (
  projectId: string,
  region?: string,
): Promise<TInstance[]> => {
  const { data } = await v6.get<TInstance[]>(
    `/cloud/project/${projectId}/instance`,
    {
      params: {
        region,
      },
    },
  );
  return data;
};

export const getInstancesByRegion = async (
  projectId: string,
  region: string,
): Promise<TInstance[]> => {
  const { data } = await v6.get<TInstance[]>(
    `/cloud/project/${projectId}/region/${region}/instance`,
  );
  return data;
};
