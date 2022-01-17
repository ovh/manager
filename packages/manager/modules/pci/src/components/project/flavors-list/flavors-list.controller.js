import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

export default class FlavorsListController {
  /* @ngInject */
  constructor($filter, $q, $state, coreConfig, PciProjectFlavors) {
    this.$filter = $filter;
    this.$q = $q;
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.PciProjectFlavors = PciProjectFlavors;
  }

  $onInit() {
    this.quotaUrl = this.$state.href('pci.projects.project.quota');
    this.isLoading = true;
    this.flavorCount = this.flavorCount || 1;
    return this.$q
      .all({
        flavors: this.getFlavors(),
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
      });
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
  }

  getFlavors() {
    let flavorsPromise = null;
    if (!isEmpty(this.flavors)) {
      flavorsPromise = this.$q.when(this.flavors);
    } else {
      flavorsPromise = this.PciProjectFlavors.getFlavors(
        this.serviceName,
        get(this.region, 'name'),
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
      this.findFlavor();

      return flavors;
    });
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
}
