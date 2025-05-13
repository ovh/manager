import { QUOTA_THRESHOLD } from './projects.constant';

export default class Quota {
  constructor({ instance, keypair, region, volume, network, loadbalancer }) {
    Object.assign(this, {
      instance,
      keypair,
      region,
      volume,
      network,
      loadbalancer,
    });
    this.quotaAboveThreshold = false;
    if (this.isInstanceQuotaAvailable()) {
      this.generateInstanceUsage();
    }
    if (this.isVolumeQuotaAvailable()) {
      this.generateVolumeUsage();
    }
  }

  generateInstanceUsage() {
    this.instance.instanceUsage = Quota.getUsagePercentage(
      this.instance.maxInstances,
      this.instance.usedInstances,
    );
    this.instance.cpuUsage = Quota.getUsagePercentage(
      this.instance.maxCores,
      this.instance.usedCores,
    );
    this.instance.ramUsage = Quota.getUsagePercentage(
      this.instance.maxRam,
      this.instance.usedRAM,
    );
    if (
      this.instance.instanceUsage >= QUOTA_THRESHOLD ||
      this.instance.cpuUsage >= QUOTA_THRESHOLD ||
      this.instance.ramUsage >= QUOTA_THRESHOLD
    ) {
      this.quotaAboveThreshold = true;
    }
  }

  generateVolumeUsage() {
    this.volume.memoryUsage = Quota.getUsagePercentage(
      this.volume.maxGigabytes,
      this.volume.usedGigabytes,
    );
    if (this.volume.memoryUsage >= QUOTA_THRESHOLD) {
      this.quotaAboveThreshold = true;
    }
  }

  isInstanceQuotaAvailable() {
    return this.instance != null;
  }

  isVolumeQuotaAvailable() {
    return this.volume != null;
  }

  isQuotaAvailable() {
    return this.isInstanceQuotaAvailable() && this.isVolumeQuotaAvailable();
  }

  isQuotaAboveThreshold() {
    return this.quotaAboveThreshold;
  }

  isInstanceQuotaThresholdReached() {
    return (
      this.isInstanceQuotaAvailable() &&
      this.instance.instanceUsage >= QUOTA_THRESHOLD
    );
  }

  isCpuQuotaThresholdReached() {
    return (
      this.isInstanceQuotaAvailable() &&
      this.instance.cpuUsage >= QUOTA_THRESHOLD
    );
  }

  isRamQuotaThresholdReached() {
    return (
      this.isInstanceQuotaAvailable() &&
      this.instance.ramUsage >= QUOTA_THRESHOLD
    );
  }

  isVolumeQuotaThresholdReached() {
    return (
      this.isVolumeQuotaAvailable() &&
      this.volume.memoryUsage >= QUOTA_THRESHOLD
    );
  }

  static getUsagePercentage(max, used) {
    if (max === 0) {
      return 100;
    }
    return (used / max) * 100;
  }
}
