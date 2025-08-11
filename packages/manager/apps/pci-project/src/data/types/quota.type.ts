export type Quota = {
  region: string;
  instance: {
    maxCores: number;
    maxInstances: number;
    maxRam: number;
    usedCores: number;
    usedInstances: number;
    usedRAM: number;
    instanceUsage?: number;
    cpuUsage?: number;
    ramUsage?: number;
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
    memoryUsage?: number;
  };
  quotaAboveThreshold?: boolean;
};
