export default class PciProjectGatewayModelSelectorCtrl {
  /* @ngInject */
  constructor(coreConfig, PciProjectGatewayModelSelectorService, $translate) {
    this.coreConfig = coreConfig;
    this.PciProjectGatewayModelSelectorService = PciProjectGatewayModelSelectorService;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = true;
    this.currency = null;
    this.gateway = {};
    this.yearlyGatewayPrice = 12;
    this.user = this.coreConfig.getUser();
    this.PciProjectGatewayModelSelectorService.getGatewayCatalog(
      this.ovhSubsidiary,
    )
      .then((data) => {
        this.gatewayCatalog = [
          ...new Set(data.map((gatewayInfo) => gatewayInfo.product)),
        ].map((product) => {
          return {
            product,
            gatewayInfo: data.filter((gateway) => gateway.product === product),
          };
        });
        [this.selectedGatewaySize] = this.gatewayCatalog;
        this.onGatewaySizeSelection({ gateway: this.selectedGatewaySize });
      })
      .finally(() => {
        this.loading = false;
      });
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
