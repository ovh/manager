import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

export default class FlavorsListController {
  /* @ngInject */
  constructor($q, PciProjectFlavors) {
    this.$q = $q;
    this.PciProjectFlavors = PciProjectFlavors;
  }

  $onInit() {
    this.isLoading = true;
    this.flavorCount = this.flavorCount || 1;
    return this.getFlavors().finally(() => {
      this.isLoading = false;
    });
  }

  $onChanges(changesObj) {
    // remove selected flavor if quota is not sufficient
    if (changesObj.flavorCount &&
      !changesObj.flavorCount.isFirstChange() &&
      changesObj.flavorCount.currentValue !== changesObj.flavorCount.previousValue &&
      this.selectedFlavor &&
      this.region) {
        const hasQuota = this.region.hasEnoughQuotaForFlavors(this.selectedFlavor, changesObj.flavorCount.currentValue);
        if(!hasQuota) {
          this.flavor = null;
          this.onFlavorChange(this.flavor);
        }
    }
  }

  getFlavors() {
    let flavorsPromise = null;
    if(!isEmpty(this.flavors)) {
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

  onFlavorChange(flavor) {
    this.selectedFlavor = flavor;
    if (this.onChange) {
      this.onChange({ flavor: this.selectedFlavor });
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
}
