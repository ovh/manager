export default class PciMaintenanceBannerComponentController {
  $onInit() {
    // regions concerned by maintenance
    this.regionsMaintenance = this.steins.map(({ zone }) => zone);

    // Used to display banner on project page
    this.isCustomerConcernedByMaintenance = this.customerRegions.some(
      (region) => this.regionsMaintenance.includes(region),
    );

    // Used to know if a product (instance, kube, ...) has a planned maintenance
    this.isProductConcernedByMaintenance = (
      this.productRegions || []
    ).some((region) => this.regionsMaintenance.includes(region));
  }

  isDisplayableBanner() {
    return (
      (this.isProjectPage && this.isCustomerConcernedByMaintenance) ||
      (this.isListPage && this.isProductConcernedByMaintenance) ||
      (this.isDashboardPage &&
        this.regionsMaintenance.includes(this.productRegion))
    );
  }
}
