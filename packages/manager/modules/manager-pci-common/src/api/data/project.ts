import { v6 } from '@ovh-ux/manager-core-api';

export type TProjectStatus =
  | 'creating'
  | 'deleted'
  | 'deleting'
  | 'ok'
  | 'suspended';

export type TProject = {
  access: 'full' | 'restricted';
  creationDate: string;
  description?: string;
  expiration?: string | null;
  iam: {
    displayName?: string;
    id: string;
    tags?: Record<string, string>;
    urn: string;
  };
  manualQuota: boolean;
  orderId: number | null;
  planCode: string;
  projectName: string | null;
  project_id: string;
  status: TProjectStatus;
  unleash: boolean;
};

export const getProject = async (projectId: string): Promise<TProject> => {
  const { data } = await v6.get(`/cloud/project/${projectId}`);
  return data;
};

export type TProjectUpdate = {
  description: string | null;
  manualQuota: boolean;
};

export const updateProject = async (
  projectId: string,
  { description, manualQuota }: TProjectUpdate,
): Promise<void> => {
  const { data } = await v6.put(`/cloud/project/${projectId}`, {
    description,
    manualQuota,
  });
  return data;
};

export type TQuota = {
  instance?: {
    maxCores: number;
    maxInstances: number;
    maxRam: number;
    usedCores: number;
    usedInstances: number;
    usedRAM: number;
  };
  keymanager?: {
    maxSecrets: number;
    usedSecrets: number;
  };
  keypair?: {
    maxCount: number;
  };
  loadbalancer?: {
    maxLoadbalancers: number;
    usedLoadbalancers: number;
  };
  network?: {
    maxFloatingIPs: number;
    maxGateways: number;
    maxNetworks: number;
    maxSubnets: number;
    usedFloatingIPs: number;
    usedGateways: number;
    usedNetworks: number;
    usedSubnets: number;
  };
  region: string;
  share?: {
    maxShareSizePerShare: number;
    maxShareSizeTotal: number;
    maxShareSnapshots: number;
    maxSharesNumber: number;
    usedShareSizeTotal: number;
    usedShareSnapshots: number;
    usedSharesNumber: number;
  };
  volume?: {
    maxBackupGigabytes: number;
    maxGigabytes: number;
    maxVolumeBackupCount: number;
    maxVolumeCount: number;
    usedBackupGigabytes: number;
    usedGigabytes: number;
    volumeBackupCount: number;
    volumeCount: number;
  };
};

export const getProjectQuota = async (projectId: string): Promise<TQuota[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/quota`);
  return data;
};
