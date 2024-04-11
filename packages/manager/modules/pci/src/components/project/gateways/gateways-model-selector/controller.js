export default class PciProjectGatewayModelSelectorCtrl {
  /* @ngInject */
  constructor(coreConfig, $translate) {
    this.coreConfig = coreConfig;
    this.$translate = $translate;
  }

  // Gateway:{product, planCode, bandwidth, price, monthlyPrice}

  $onInit() {
    this.loading = true;
    this.gateway = {};
    this.yearlyGatewayPrice = 12;
    this.user = this.coreConfig.getUser();

    // Convert data from catalog et regionAvailability plan codes list.
    const allGatewayCatalog = this.regionAvailability
      .filter(({ regions }) => regions.length)
      .map(({ code }) => {
        const addonPlan = this.catalog.addons.find(
          (addon) => addon.planCode === code,
        );
        const addonPrice = addonPlan?.pricings.find((price) =>
          price.capacities.includes('consumption'),
        )?.price;
        return {
          product: addonPlan.product,
          planCode: code,
          price: addonPrice,
          monthly: addonPlan.blobs.commercial.price.interval === 'P1M',
          bandwidth: addonPlan.blobs.technical.bandwidth.level,
          model: addonPlan.blobs.technical.model || '?',
        };
      });

    // Only keep hourly plans and attach monthly price
    this.gatewayCatalog = allGatewayCatalog
      .filter((g) => !g.monthly)
      .map((gateway) => ({
        ...gateway,
        monthlyPrice: allGatewayCatalog.find(
          (g) => g.product === gateway.product && g.monthly,
        )?.price,
      }))
      .sort((a, b) => a.price - b.price);

    // Set default value
    if (this.gateway.length) {
      this.onGatewaySizeSelection({ gateway: this.gatewayCatalog[0] });
    }
  }

  // Manipulate unit of bandwidth manually based on level value 500 -> 500 Mbps 2000 -> 2Gbps
  getBandwidth(bandwidthLevel) {
    return bandwidthLevel > 1000
      ? bandwidthLevel / 1000 +
          this.$translate.instant(
            'pci_projects_project_gateways_model_selector_bandwidth_unit_size_gbps',
          )
      : bandwidthLevel +
          this.$translate.instant(
            'pci_projects_project_gateways_model_selector_bandwidth_unit_size_mbps',
          );
  }
}
