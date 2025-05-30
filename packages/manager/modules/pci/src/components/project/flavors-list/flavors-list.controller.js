import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

import { TAGS_BLOB } from '../../../constants';

export default class FlavorsListController {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $state,
    $timeout,
    coreConfig,
    PciProjectFlavors,
    PciProject,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.PciProjectFlavors = PciProjectFlavors;
    this.PciProject = PciProject;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.quotaUrl = this.$state.href('pci.projects.project.quota');
    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');
    this.zone3azUrl = this.PciProject.getDocumentUrl('REGIONS_3AZ');
    this.flavorCount = this.flavorCount || 1;
    return this.load({ force: true });
  }

  $onChanges(changesObj) {
    // remove selected flavor if quota is not sufficient
    if (
      changesObj.flavorCount &&
      !changesObj.flavorCount.isFirstChange() &&
      changesObj.flavorCount.currentValue !==
        changesObj.flavorCount.previousValue &&
      this.selectedFlavor &&
      this.region
    ) {
      const hasQuota = this.region.hasEnoughQuotaForFlavors(
        this.selectedFlavor,
        changesObj.flavorCount.currentValue,
      );
      if (!hasQuota) {
        this.flavor = null;
        this.onFlavorChange(this.flavor);
      }
    }
    if (
      changesObj.reload?.currentValue === true &&
      changesObj.reload?.previousValue !== true
    ) {
      this.load({ force: true });
    }
  }

  load({ force = false } = {}) {
    this.isLoading = true;
    return this.$q
      .all({
        flavors: this.getFlavors({ force }),
        me: this.coreConfig.getUser(),
      })
      .then(({ me }) => {
        this.PriceFormatter = new Intl.NumberFormat(
          this.coreConfig.getUserLocale().replace('_', '-'),
          {
            style: 'currency',
            currency: me.currency.code,
            maximumFractionDigits: 5, // default is 2. But this rounds off the price
          },
        );
      })
      .finally(() => {
        this.isLoading = false;
        this.$timeout(() => {
          this.loadEnd();
        });
      });
  }

  getFlavors({ force = false } = {}) {
    let flavorsPromise = null;
    if (!force && !isEmpty(this.flavors)) {
      flavorsPromise = this.$q.when(this.flavors);
    } else {
      flavorsPromise = this.PciProjectFlavors.getFlavors(
        this.serviceName,
        get(this.region, 'name'),
        this.catalogEndpoint,
        force,
      );
    }
    return flavorsPromise.then((flavors) => {
      const flavorGroups = this.PciProjectFlavors.constructor.mapByFlavorType(
        filter(
          flavors,
          (flavor) =>
            flavor.isAvailable() &&
            flavor.hasSsdDisk() &&
            (!this.image || flavor.hasOsType(this.image.type)),
        ),
        get(this.image, 'type'),
      );

      this.flavors = this.PciProjectFlavors.constructor.groupByCategory(
        flavorGroups,
      );

      this.selectedCategory =
        this.selectedCategory || get(first(this.flavors), 'category');
      if (force && this.selectedFlavor && this.selectedCategory) {
        this.selectedFlavor = find(
          this.flavors.map(({ flavors: groups }) => groups).flat(),
          { name: this.selectedFlavor.name },
        );
      }
      this.findFlavor();

      return flavors;
    });
  }

  static isPricingComingSoon(flavor) {
    return !flavor?.prices?.monthly;
  }

  static isNewFlavor(flavor) {
    return flavor?.tagsBlob?.includes(TAGS_BLOB.IS_NEW);
  }

  findFlavor() {
    if (this.defaultFlavor) {
      forEach(this.flavors, (flavorCategory) => {
        const flavorGroup = find(flavorCategory.flavors, (group) =>
          group.getFlavor(this.defaultFlavor.id),
        );

        if (flavorGroup) {
          this.selectedCategory = get(flavorCategory, 'category');
          this.flavor = flavorGroup;
          this.onFlavorChange(flavorGroup);
        }
      });
    }
  }

  onFlavorChange(flavor, category) {
    this.selectedFlavor = flavor;
    if (this.onChange) {
      this.onChange({ flavor: this.selectedFlavor, category });
    }
  }

  onFlavorCategoryChange() {
    if (!this.selectedCategory) {
      return;
    }
    if (this.onCategoryChange) {
      this.onCategoryChange({ category: this.selectedCategory });
    }
  }

  hasEnoughDisk(flavor) {
    if (this.defaultFlavor) {
      return flavor.disk >= this.defaultFlavor.disk;
    }

    if (this.image) {
      return flavor.disk >= this.image.minDisk;
    }

    return true;
  }

  isFlavorCategoryIncluded(category) {
    return (
      (!this.includeCategories || this.includeCategories.includes(category)) &&
      !(this.excludeCategories && this.excludeCategories.includes(category))
    );
  }

  getStorageLabel(flavor) {
    if (flavor.technicalBlob) {
      const { disks } = flavor.technicalBlob.storage;
      return disks
        .map((disk) => {
          const multiplier = disk.number > 1 ? `${disk.number} x ` : '';
          const capacity = this.formatStorage(disk.capacity);
          return `${multiplier}${capacity} ${disk.technology ||
            disk.interface}`;
        })
        .join(' + ');
    }
    return `${this.formatStorage(
      flavor.disk,
    )} ${flavor.diskType.toUpperCase()}`;
  }

  formatStorage(capacity) {
    return this.$filter('bytes')(capacity, 2, false, 'GB');
  }

  /**
   * Get the lowest hourly price and lowest monthly price for the flavor
   * and return distinct prices for both hourly and monthly
   * @param {*} flavor
   * @returns Object with lowest hourly / monthly and all distinct hourly / monthly
   */
  static getLowestAndDistinctPriceFromFlavor(flavor) {
    const result = {
      lowestHourlyPrice: null,
      lowestMonthlyPrice: null,
      allHourlyPrices: [],
      allMontlyPrices: [],
    };

    flavor.flavors
      .flatMap((f) => f.priceInformation)
      .forEach((current) => {
        // Manage the hourly prices for the flavor
        if (current.prices.hourly?.value) {
          // add current hourly price to distinct prices array
          if (!result.allHourlyPrices.includes(current.prices.hourly.value)) {
            result.allHourlyPrices.push(current.prices.hourly.value);
          }

          // Check if the current price is the lowest
          if (
            !result.lowestHourlyPrice ||
            result.lowestHourlyPrice.value > current.prices.hourly.value
          ) {
            result.lowestHourlyPrice = current.prices.hourly;
          }
        }

        // Manage the monthly prices for the flavor
        if (current.prices.monthly?.value) {
          // add current monthly price to distinct prices array
          if (!result.allMontlyPrices.includes(current.prices.monthly.value)) {
            result.allMontlyPrices.push(current.prices.monthly.value);
          }

          // Check if the current price is the lowest
          if (
            !result.lowestMonthlyPrice ||
            result.lowestMonthlyPrice.value > current.prices.monthly.value
          ) {
            result.lowestMonthlyPrice = current.prices.monthly;
          }
        }
      });

    return result;
  }
}
