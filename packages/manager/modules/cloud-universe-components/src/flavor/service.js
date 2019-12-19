import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import includes from 'lodash/includes';
import set from 'lodash/set';
import uniq from 'lodash/uniq';

export default class CucFlavorService {
  /* @ngInject */
  constructor(
    $filter,
    CUC_FLAVOR_FLAVORTYPE_CATEGORY,
    CUC_FLAVOR_INSTANCE_CPU_FREQUENCY,
    CUC_FLAVOR_INSTANCE_NUMBER_OF_GPUS,
  ) {
    this.$filter = $filter;
    this.CUC_FLAVOR_FLAVORTYPE_CATEGORY = CUC_FLAVOR_FLAVORTYPE_CATEGORY;
    this.CUC_FLAVOR_INSTANCE_CPU_FREQUENCY = CUC_FLAVOR_INSTANCE_CPU_FREQUENCY;
    this.CUC_FLAVOR_INSTANCE_NUMBER_OF_GPUS = CUC_FLAVOR_INSTANCE_NUMBER_OF_GPUS;
  }

  static isOldFlavor(flavorName) {
    const oldFlavorRegex = /eg|sp|hg|vps-ssd/;
    return oldFlavorRegex.test(flavorName);
  }

  static getFlavorTypes(flavors) {
    return uniq(map(flavors, 'type'));
  }

  static addPriceInfos(flavor, prices) {
    const price = { price: { value: 0 }, monthlyPrice: { value: 0 } };
    const planHourly = prices[get(flavor, 'planCodes.hourly')];
    if (planHourly) {
      set(price, 'price', planHourly.price);
      // Set 3 digits for hourly price
      set(price, 'price.text', get(price, 'price.text', '').replace(/\d+(?:[.,]\d+)?/, `${price.price.value.toFixed(3)}`));
    }
    const planMonthly = prices[get(flavor, 'planCodes.monthly')];
    if (planMonthly) {
      set(price, 'monthlyPrice', planMonthly.price);
    }
    set(flavor, 'price', price);
  }

  static addOverQuotaInfos(flavor, quota, minDisk = 0, minRam = 0) {
    const quotaByRegion = find(quota, { region: flavor.region });
    const instanceQuota = get(quotaByRegion, 'instance', false);
    if (instanceQuota) {
      // set over quota reason
      if (instanceQuota.maxInstances !== -1
        && instanceQuota.usedInstances >= instanceQuota.maxInstances) {
        set(flavor, 'disabled', 'QUOTA_INSTANCE');
      } else if (flavor.ram && instanceQuota.maxRam !== -1
          && flavor.ram > instanceQuota.maxRam - instanceQuota.usedRAM) {
        set(flavor, 'disabled', 'QUOTA_RAM');
      } else if (flavor.vcpus
          && instanceQuota.maxCores !== -1
          && flavor.vcpus > instanceQuota.maxCores - instanceQuota.usedCores) {
        set(flavor, 'disabled', 'QUOTA_VCPUS');
      }

      // set max instances (-1 : unlimited)
      if (instanceQuota.maxInstances === -1) {
        set(flavor, 'maxInstance', -1);
      } else {
        set(flavor, 'maxInstance', instanceQuota.maxInstances - instanceQuota.usedInstances);
      }

      if (instanceQuota.maxRam === -1) {
        set(flavor, 'maxInstance', Math.max(flavor.maxInstance, -1));
      } else {
        set(flavor, 'maxInstance', Math.min(flavor.maxInstance > -1 ? flavor.maxInstance : 1000, Math.floor((instanceQuota.maxRam - instanceQuota.usedRAM) / flavor.ram)));
      }

      if (instanceQuota.maxCores === -1) {
        set(flavor, 'maxInstance', Math.max(flavor.maxInstance, -1));
      } else {
        set(flavor, 'maxInstance', Math.min(flavor.maxInstance > -1 ? flavor.maxInstance : 1000, Math.floor((instanceQuota.maxCores - instanceQuota.usedCores) / flavor.vcpus)));
      }
    }

    if (minDisk > flavor.disk && !flavor.disabled) {
      set(flavor, 'disabled', 'QUOTA_MINDISK');
    }

    if (minRam > flavor.ram && !flavor.disabled) {
      set(flavor, 'disabled', 'QUOTA_MINRAM');
    }
  }

  getQuotaRam(flavor, quota) {
    const quotaByRegion = find(quota, { region: flavor.region });
    const instanceQuota = get(quotaByRegion, 'instance', false);
    if (instanceQuota) {
      return {
        max: this.$filter('cucBytes')(instanceQuota.maxRam, 0, false, 'MB'),
        used: this.$filter('cucBytes')(instanceQuota.usedRAM, 0, false, 'MB'),
        remaining: this.$filter('cucBytes')(instanceQuota.maxRam - instanceQuota.usedRAM, 0, false, 'MB'),
        required: this.$filter('cucBytes')(flavor.ram, 0, false, 'MB'),
      };
    }
    return null;
  }

  static getQuotaCore(flavor, quota) {
    const quotaByRegion = find(quota, { region: flavor.region });
    const instanceQuota = get(quotaByRegion, 'instance', false);
    if (instanceQuota) {
      return {
        max: instanceQuota.maxCores,
        used: instanceQuota.usedCores,
        remaining: instanceQuota.maxCores - instanceQuota.usedCores,
        required: flavor.vcpus,
      };
    }
    return null;
  }

  getRequirements(flavor, image) {
    return {
      name: get(image, 'name', undefined),
      currentDisk: this.$filter('cucBytes')(flavor.disk, 2, false, 'GB'),
      currentRam: this.$filter('cucBytes')(flavor.ram, 2, false, 'MB'),
      requiredDisk: this.$filter('cucBytes')(image.minDisk, 2, false, 'GB') || undefined,
      requiredRam: this.$filter('cucBytes')(image.minRam, 2, false, 'MB') || undefined,
    };
  }

  augmentFlavor(flavor) {
    if (!flavor) {
      return null;
    }

    const augmentedFlavor = cloneDeep(flavor);
    augmentedFlavor.frequency = this.CUC_FLAVOR_INSTANCE_CPU_FREQUENCY[flavor.type];

    if (/vps/.test(flavor.type)) {
      return {
        vps: true,
        diskType: 'ssd',
        flex: false,
        shortGroupName: flavor.name,
        ...augmentedFlavor,
      };
    }

    let shortType;
    let numberType;

    if (flavor.osType === 'windows') {
      [, shortType, numberType] = flavor.name.split('-');
    } else {
      [shortType, numberType] = flavor.name.split('-');
    }

    if (shortType) {
      augmentedFlavor.shortType = shortType;
    }

    if (numberType) {
      augmentedFlavor.numberType = numberType;
    }

    if (shortType && numberType) {
      augmentedFlavor.shortGroupName = `${shortType}-${numberType}`;
    }

    augmentedFlavor.flex = /flex$/.test(flavor.name);
    augmentedFlavor.diskType = [/ssd/, /nvme/].some((regex) => regex.test(flavor.type)) ? 'ssd' : 'ceph';

    const flavorContainsGPUs = includes(['g1', 'g2', 'g3', 't1'], augmentedFlavor.shortType);
    if (flavorContainsGPUs) {
      augmentedFlavor.imageType = flavor.osType === 'windows' ? ['uefi'] : augmentedFlavor.imageType;
      augmentedFlavor.gpuCardCount = get(
        this.CUC_FLAVOR_INSTANCE_NUMBER_OF_GPUS,
        numberType,
        this.CUC_FLAVOR_INSTANCE_NUMBER_OF_GPUS.default,
      );
    }

    augmentedFlavor.isOldFlavor = CucFlavorService.isOldFlavor(flavor.name);

    return augmentedFlavor;
  }

  getCategory(flavorType) {
    return find(
      this.CUC_FLAVOR_FLAVORTYPE_CATEGORY,
      (currentCategory) => includes(currentCategory.types, flavorType),
    );
  }
}
