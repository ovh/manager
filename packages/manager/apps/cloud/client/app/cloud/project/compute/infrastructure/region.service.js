import find from 'lodash/find';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import set from 'lodash/set';

class CloudRegionService {
  static addOverQuotaInfos(region, quota) {
    const quotaByRegion = find(quota, {
      region: get(region, 'microRegion.code'),
    });
    const instanceQuota = get(quotaByRegion, 'instance', false);
    if (instanceQuota) {
      if (
        instanceQuota.maxInstances !== -1 &&
        instanceQuota.usedInstances >= instanceQuota.maxInstances
      ) {
        set(region, 'disabled', 'QUOTA_INSTANCE');
      } else if (
        instanceQuota.maxRam !== -1 &&
        instanceQuota.usedRAM >= instanceQuota.maxRam
      ) {
        set(region, 'disabled', 'QUOTA_RAM');
      } else if (
        instanceQuota.maxCores !== -1 &&
        instanceQuota.usedCores >= instanceQuota.maxCores
      ) {
        set(region, 'disabled', 'QUOTA_VCPUS');
      }
    }
  }

  static checkSshKey(region, sshKeyRegions) {
    const found = indexOf(sshKeyRegions, get(region, 'microRegion.code'));
    if (!region.disabled && found === -1) {
      set(region, 'disabled', 'SSH_KEY');
    } else if (region.disabled === 'SSH_KEY' && found > -1) {
      // eslint-disable-next-line no-param-reassign
      delete region.disabled;
    }
  }

  static isActive(region) {
    return !region.notAvailable;
  }

  static setRegionInactiveMessage(region) {
    set(region, 'disabled', 'INACTIVE');
  }
}

angular.module('managerApp').service('CloudRegionService', CloudRegionService);
