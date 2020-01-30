import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import map from 'lodash/map';
import set from 'lodash/set';
import uniq from 'lodash/uniq';

(() => {
  const oldFlavorRegex = /eg|sp|hg|vps-ssd/;

  class CloudFlavorService {
    constructor(
      $filter,
      CLOUD_FLAVORTYPE_CATEGORY,
      CLOUD_INSTANCE_CPU_FREQUENCY,
      CLOUD_INSTANCE_NUMBER_OF_GPUS,
    ) {
      this.$filter = $filter;

      this.CLOUD_FLAVORTYPE_CATEGORY = CLOUD_FLAVORTYPE_CATEGORY;
      this.CLOUD_INSTANCE_CPU_FREQUENCY = CLOUD_INSTANCE_CPU_FREQUENCY;
      this.CLOUD_INSTANCE_NUMBER_OF_GPUS = CLOUD_INSTANCE_NUMBER_OF_GPUS;

      this.initFlavorNameFormatRules();
    }

    static isOldFlavor(flavorName) {
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
        set(
          price,
          'price.text',
          get(price, 'price.text', '').replace(
            /\d+(?:[.,]\d+)?/,
            `${price.price.value.toFixed(3)}`,
          ),
        );
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
        if (
          instanceQuota.maxInstances !== -1 &&
          instanceQuota.usedInstances >= instanceQuota.maxInstances
        ) {
          set(flavor, 'disabled', 'QUOTA_INSTANCE');
        } else if (
          flavor.ram &&
          instanceQuota.maxRam !== -1 &&
          flavor.ram > instanceQuota.maxRam - instanceQuota.usedRAM
        ) {
          set(flavor, 'disabled', 'QUOTA_RAM');
        } else if (
          flavor.vcpus &&
          instanceQuota.maxCores !== -1 &&
          flavor.vcpus > instanceQuota.maxCores - instanceQuota.usedCores
        ) {
          set(flavor, 'disabled', 'QUOTA_VCPUS');
        }

        // set max instances (-1 : unlimited)
        if (instanceQuota.maxInstances === -1) {
          set(flavor, 'maxInstance', -1);
        } else {
          set(
            flavor,
            'maxInstance',
            instanceQuota.maxInstances - instanceQuota.usedInstances,
          );
        }

        if (instanceQuota.maxRam === -1) {
          set(flavor, 'maxInstance', Math.max(flavor.maxInstance, -1));
        } else {
          set(
            flavor,
            'maxInstance',
            Math.min(
              flavor.maxInstance > -1 ? flavor.maxInstance : 1000,
              Math.floor(
                (instanceQuota.maxRam - instanceQuota.usedRAM) / flavor.ram,
              ),
            ),
          );
        }

        if (instanceQuota.maxCores === -1) {
          set(flavor, 'maxInstance', Math.max(flavor.maxInstance, -1));
        } else {
          set(
            flavor,
            'maxInstance',
            Math.min(
              flavor.maxInstance > -1 ? flavor.maxInstance : 1000,
              Math.floor(
                (instanceQuota.maxCores - instanceQuota.usedCores) /
                  flavor.vcpus,
              ),
            ),
          );
        }
      }

      if (minDisk > flavor.disk && !flavor.disabled) {
        set(flavor, 'disabled', 'QUOTA_MINDISK');
      }

      if (minRam > flavor.ram && !flavor.disabled) {
        set(flavor, 'disabled', 'QUOTA_MINRAM');
      }
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

    initFlavorNameFormatRules() {
      this.rules = [
        {
          condition: ({ currentIndex, currentValue }) =>
            currentIndex === 0 && `${currentValue}`.toUpperCase() === 'WIN',
          mapping: () => '',
        },
        {
          condition: ({ currentValue, inputParts, currentIndex }) =>
            `${currentValue}`.toUpperCase() === 'FLEX' &&
            inputParts.length - 1 === currentIndex,
          mapping: (value) => ` - ${value[0].toUpperCase()}${value.substr(1)}`,
        },
        {
          condition: () => true,
          mapping: (value) => `${value.toUpperCase()}`,
          intermediateHyphen: true,
        },
      ];
    }

    /**
     * convert flavor name to redable format
     * examples
     * win-hg-120-ssd-flex to HG-120-SSD - Flex
     * hg-60-ssd-flex to HG-60-SSD - Flex
     * s1-4 to S1-4
     * gpu-60-flex to GPU-60 - Flex
     * @param {string} flavorName
     */
    formatFlavorName(flavorName) {
      const inputParts = flavorName.split('-');
      return []
        .concat(
          ...inputParts.map((currentValue, currentIndex) => {
            const matchingRule = this.rules.find((rule) =>
              rule.condition({
                currentValue,
                currentIndex,
                inputParts,
              }),
            );

            const rawReturnValue = matchingRule.mapping(currentValue);
            return matchingRule.intermediateHyphen
              ? [
                  { value: rawReturnValue, needsHyphen: true },
                  { isHyphen: true },
                ]
              : { value: rawReturnValue };
          }),
        )
        .reduce((accumulator, currentValue, currentIndex, array) => {
          let valueToAppend = '';
          if (currentValue.isHyphen) {
            if (currentIndex + 1 !== array.length) {
              valueToAppend = '-';
            }
          }

          if (!currentValue.isHyphen && currentValue.needsHyphen) {
            valueToAppend = currentValue.value;
          }

          if (!currentValue.isHyphen && !currentValue.needsHyphen) {
            accumulator.pop();
            valueToAppend = currentValue.value;
          }

          return [...accumulator, valueToAppend];
        }, [])
        .join('');
    }

    getQuotaRam(flavor, quota) {
      const quotaByRegion = find(quota, { region: flavor.region });
      const instanceQuota = get(quotaByRegion, 'instance', false);
      if (instanceQuota) {
        return {
          max: this.$filter('bytes')(instanceQuota.maxRam, 0, false, 'MB'),
          used: this.$filter('bytes')(instanceQuota.usedRAM, 0, false, 'MB'),
          remaining: this.$filter('bytes')(
            instanceQuota.maxRam - instanceQuota.usedRAM,
            0,
            false,
            'MB',
          ),
          required: this.$filter('bytes')(flavor.ram, 0, false, 'MB'),
        };
      }
      return null;
    }

    getRequirements(flavor, image) {
      return {
        name: get(image, 'name', undefined),
        currentDisk: this.$filter('bytes')(flavor.disk, 2, false, 'GB'),
        currentRam: this.$filter('bytes')(flavor.ram, 2, false, 'MB'),
        requiredDisk:
          this.$filter('bytes')(image.minDisk, 2, false, 'GB') || undefined,
        requiredRam:
          this.$filter('bytes')(image.minRam, 2, false, 'MB') || undefined,
      };
    }

    augmentFlavor(flavor) {
      if (!flavor) {
        return null;
      }

      const augmentedFlavor = cloneDeep(flavor);
      augmentedFlavor.frequency = this.CLOUD_INSTANCE_CPU_FREQUENCY[
        flavor.type
      ];
      augmentedFlavor.formattedName = this.formatFlavorName(
        augmentedFlavor.name,
      );
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
      augmentedFlavor.diskType = [/ssd/, /nvme/].some((regex) =>
        regex.test(flavor.type),
      )
        ? 'ssd'
        : 'ceph';

      const flavorContainsGPUs = includes(
        ['g1', 'g2', 'g3', 't1'],
        augmentedFlavor.shortType,
      );
      if (flavorContainsGPUs) {
        augmentedFlavor.gpuCardCount = get(
          this.CLOUD_INSTANCE_NUMBER_OF_GPUS,
          numberType,
          this.CLOUD_INSTANCE_NUMBER_OF_GPUS.default,
        );
      }

      augmentedFlavor.isOldFlavor = CloudFlavorService.isOldFlavor(flavor.name);

      return augmentedFlavor;
    }

    getCategory(flavorType) {
      return find(this.CLOUD_FLAVORTYPE_CATEGORY, (currentCategory) =>
        includes(currentCategory.types, flavorType),
      );
    }
  }

  angular
    .module('managerApp')
    .service('CloudFlavorService', CloudFlavorService);
})();
