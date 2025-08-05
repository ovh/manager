/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * The hooks will be available in the `@ovh-ux/manager-pci-common` package.
 */
import { useQuery } from '@tanstack/react-query';

import { v6 } from '@ovh-ux/manager-core-api';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
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

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getProjectQuota = async (projectId: string) => {
  const { data } = await v6.get<TProjectQuota[]>(
    `/cloud/project/${projectId}/quota`,
  );

  return data;
};

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useProjectQuota = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'quota'],
    queryFn: () => getProjectQuota(projectId),
  });
