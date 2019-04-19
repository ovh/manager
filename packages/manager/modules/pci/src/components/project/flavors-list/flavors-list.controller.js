import filter from 'lodash/filter';

export default class FlavorsListController {
  /* @ngInject */
  constructor(
    PciProjectFlavors,
  ) {
    this.PciProjectFlavors = PciProjectFlavors;
  }

  $onInit() {
    this.isLoading = true;

    return this.getFlavors()
      .finally(() => {
        this.isLoading = false;
      });
  }

  getFlavors() {
    return this.PciProjectFlavors.getFlavors(this.serviceName)
      .then((flavors) => {
        const flavorGroups = this.PciProjectFlavors.constructor.mapByFlavorType(
          filter(flavors, flavor => flavor.isAvailable()
            && !flavor.isLegacy()
            && flavor.hasSsdDisk()
            && !flavor.isFlex()),
        );
        this.flavors = this.PciProjectFlavors.constructor.groupByCategory(flavorGroups);
        return flavors;
      });
  }

  onFlavorChange(flavor) {
    this.selectedFlavor = flavor;
  }
}
