export default class PciProjectGatewayModelSelectorCtrl {
  /* @ngInject */
  constructor(coreConfig, PciProjectGatewayModelSelectorService) {
    this.coreConfig = coreConfig;
    this.PciProjectGatewayModelSelectorService = PciProjectGatewayModelSelectorService;
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
}
