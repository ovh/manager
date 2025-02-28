import { describe, it, expect } from 'vitest';
import { Quota } from '@/api/data/quota';
import {
  isCpuQuotaThresholdReached,
  isInstanceQuotaThresholdReached,
  isRamQuotaThresholdReached,
  isVolumeQuotaThresholdReached,
} from '@/helpers/thresholds';

describe('Quota threshold helper functions', () => {
  const mockQuota: Quota = {
    region: 'region1',
    instance: {
      maxCores: 10,
      maxInstances: 5,
      maxRam: 2048,
      usedCores: 2,
      usedInstances: 1,
      usedRAM: 512,
    },
    loadbalancer: {
      maxLoadbalancers: 2,
      usedLoadbalancers: 1,
    },
    network: {
      maxFloatingIPs: 5,
      maxGateways: 2,
      maxNetworks: 3,
      maxSubnets: 4,
      usedFloatingIPs: 1,
      usedGateways: 1,
      usedNetworks: 2,
      usedSubnets: 3,
    },
    volume: {
      maxBackupGigabytes: 100,
      maxGigabytes: 500,
      maxVolumeBackupCount: 10,
      maxVolumeCount: 20,
      usedBackupGigabytes: 50,
      usedGigabytes: 200,
      volumeBackupCount: 5,
      volumeCount: 10,
    },
  };

  it('checks if instance quota threshold is reached', () => {
    expect(isInstanceQuotaThresholdReached(mockQuota)).toBe(false);
  });

  it('checks if CPU quota threshold is reached', () => {
    expect(isCpuQuotaThresholdReached(mockQuota)).toBe(false);
  });

  it('checks if RAM quota threshold is reached', () => {
    expect(isRamQuotaThresholdReached(mockQuota)).toBe(false);
  });

  it('checks if volume quota threshold is reached', () => {
    expect(isVolumeQuotaThresholdReached(mockQuota)).toBe(false);
  });
});
