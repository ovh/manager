import { Quota } from '@/api/data/quota';
import { QUOTA_THRESHOLD } from '@/constants';

function getUsagePercentage(max: number, used: number): number {
  return max === 0 ? 100 : (used / max) * 100;
}

function getQuotaInstancesUsage({ instance }: Quota) {
  return getUsagePercentage(instance.maxInstances, instance.usedInstances);
}

function getQuotaCpuUsage({ instance }: Quota) {
  return getUsagePercentage(instance.maxCores, instance.usedCores);
}

function getQuotaRamUsage({ instance }: Quota) {
  return getUsagePercentage(instance.maxRam, instance.usedRAM);
}

function getQuotaMemoryUsage({ volume }: Quota) {
  return getUsagePercentage(volume.maxGigabytes, volume.usedGigabytes);
}

export function isInstanceQuotaThresholdReached(quota: Quota) {
  return quota?.instance && getQuotaInstancesUsage(quota) >= QUOTA_THRESHOLD;
}

export function isCpuQuotaThresholdReached(quota: Quota) {
  return quota?.instance && getQuotaCpuUsage(quota) >= QUOTA_THRESHOLD;
}

export function isRamQuotaThresholdReached(quota: Quota) {
  return quota.instance && getQuotaRamUsage(quota) >= QUOTA_THRESHOLD;
}

export function isVolumeQuotaThresholdReached(quota?: Quota) {
  return quota?.volume && getQuotaMemoryUsage(quota) >= QUOTA_THRESHOLD;
}
