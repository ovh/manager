import { v6 } from '@ovh-ux/manager-core-api';
import { QUOTA_THRESHOLD } from '@/constants';
import { TServiceOption } from '@/api/data/service-option';

export interface IQuota {
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

export class Quota implements IQuota {
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

  static getUsagePercentage(max: number, used: number): number {
    return max === 0 ? 100 : (used / max) * 100;
  }

  get instanceInstancesUsage() {
    return Quota.getUsagePercentage(
      this.instance.maxInstances,
      this.instance.usedInstances,
    );
  }

  get instanceCpuUsage() {
    return Quota.getUsagePercentage(
      this.instance.maxCores,
      this.instance.usedCores,
    );
  }

  get instanceRamUsage() {
    return Quota.getUsagePercentage(
      this.instance.maxRam,
      this.instance.usedRAM,
    );
  }

  isInstanceQuotaAvailable() {
    return this.instance != null;
  }

  isInstanceQuotaAboveThreshold() {
    return (
      this.instanceInstancesUsage >= QUOTA_THRESHOLD ||
      this.instanceCpuUsage >= QUOTA_THRESHOLD ||
      this.instanceRamUsage >= QUOTA_THRESHOLD
    );
  }

  get volumeMemoryUsage() {
    return Quota.getUsagePercentage(
      this.volume.maxGigabytes,
      this.volume.usedGigabytes,
    );
  }

  get isVolumeQuotaAvailable() {
    return this.volume != null;
  }

  get isVolumeQuotaAboveTreshold() {
    return this.volumeMemoryUsage >= QUOTA_THRESHOLD;
  }

  get isQuotaAvailable() {
    return this.isInstanceQuotaAvailable() && this.isVolumeQuotaAvailable;
  }

  //-------
  get isInstanceQuotaThresholdReached() {
    return (
      this.isInstanceQuotaAvailable() &&
      this.instanceInstancesUsage >= QUOTA_THRESHOLD
    );
  }

  get isCpuQuotaThresholdReached() {
    return (
      this.isInstanceQuotaAvailable() &&
      this.instanceCpuUsage >= QUOTA_THRESHOLD
    );
  }

  isRamQuotaThresholdReached() {
    return (
      this.isInstanceQuotaAvailable() &&
      this.instanceRamUsage >= QUOTA_THRESHOLD
    );
  }

  get isVolumeQuotaThresholdReached() {
    return (
      this.isVolumeQuotaAvailable && this.volumeMemoryUsage >= QUOTA_THRESHOLD
    );
  }
}

export const getQuotas = async (projectId: string): Promise<IQuota[]> => {
  const { data } = await v6.get<IQuota[]>(`/cloud/project/${projectId}/quota`);
  return data;
};

export const orderQuota = async (
  projectId: string,
  cartId: number | string,
  serviceOption: TServiceOption,
): Promise<{ url: string }> => {
  const installationPrice = serviceOption.prices?.find((price) =>
    price.capacities.includes('installation'),
  );

  const { data } = await v6.post<{ url: string }>(
    `/order/cartServiceOption/cloud/${projectId}`,
    {
      cartId,
      quantity: 1,
      planCode: serviceOption.planCode,
      duration: installationPrice.duration,
      pricingMode: installationPrice.pricingMode,
    },
  );
  return {
    url: data.url,
  };
};
