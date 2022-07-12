export default class PciProjectGatewayModelSelectorCtrl {
  /* @ngInject */
  constructor(PciProjectGatewayModelSelectorService) {
    this.PciProjectGatewayModelSelectorService = PciProjectGatewayModelSelectorService;
  }

  $onInit() {
    this.loading = true;
    this.PciProjectGatewayModelSelectorService.getGatewayCatalog(
      this.ovhSubsidiary,
    )
      .then((data) => {
        this.gatewayCatalog = data;
        [this.selectedGatewaySize] = this.gatewayCatalog;
        this.onGatewaySizeSelection({ gateway: this.selectedGatewaySize });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
