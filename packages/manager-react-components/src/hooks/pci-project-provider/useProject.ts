import { useQuery } from '@tanstack/react-query';

import { v6 } from '@ovh-ux/manager-core-api';

export type TProjectQuota = {
  region: string;
  instance: {
    maxCores: number;
    maxInstances: number;
    maxRam: number;
    usedCores: number;
    usedInstances: number;
    usedRAM: number;
  };
  keypair: {
    maxCount: number;
  };
  volume: {
    maxGigabytes: number;
    usedGigabytes: number;
    volumeCount: number;
    maxVolumeCount: number;
    maxBackupGigabytes: number;
    usedBackupGigabytes: number;
    volumeBackupCount: number;
    maxVolumeBackupCount: number;
  };
  network: {
    maxNetworks: number;
    usedNetworks: number;
    maxSubnets: number;
    usedSubnets: number;
    maxFloatingIPs: number;
    usedFloatingIPs: number;
    maxGateways: number;
    usedGateways: number;
  };
  loadbalancer: {
    maxLoadbalancers: number;
    usedLoadbalancers: number;
  } | null;
  keymanager: {
    maxSecrets: number;
    usedSecrets: number;
  } | null;
  share: any | null;
};

export const getProjectQuota = async (projectId: string) => {
  const { data } = await v6.get<TProjectQuota[]>(
    `/cloud/project/${projectId}/quota`,
  );

  return data;
};

export const useProjectQuota = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'quota'],
    queryFn: () => getProjectQuota(projectId),
  });
