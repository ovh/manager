import { v6 } from '@ovh-ux/manager-core-api';

export interface Quota {
  region: string;
  instance: {
    maxCores: number;
    maxInstances: number;
    maxRam: number;
    usedCores: number;
    usedInstances: number;
    usedRAM: number;
  };

  loadbalancer: {
    maxLoadbalancers: number;
    usedLoadbalancers: number;
  };

  network: {
    maxFloatingIPs: number;
    maxGateways: number;
    maxNetworks: number;
    maxSubnets: number;
    usedFloatingIPs: number;
    usedGateways: number;
    usedNetworks: number;
    usedSubnets: number;
  };

  volume: {
    maxBackupGigabytes: number;
    maxGigabytes: number;
    maxVolumeBackupCount: number;
    maxVolumeCount: number;
    usedBackupGigabytes: number;
    usedGigabytes: number;
    volumeBackupCount: number;
    volumeCount: number;
  };
}

export const getQuotas = async (projectId: string): Promise<Quota[]> => {
  const { data } = await v6.get<Quota[]>(`/cloud/project/${projectId}/quota`);
  return data;
};

export const orderQuota = async (
  projectId: string,
  cartId: string | number,
  planCode: string,
  duration: string,
  pricingMode: string,
): Promise<{ url: string }> => {
  const { data } = await v6.post<{ url: string }>(
    `/order/cartServiceOption/cloud/${projectId}`,
    {
      cartId,
      quantity: 1,
      planCode,
      duration,
      pricingMode,
    },
  );
  return data;
};
