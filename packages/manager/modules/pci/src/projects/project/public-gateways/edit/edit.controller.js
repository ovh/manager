export default class PciPublicGatewaysEditController {
  /* @ngInject */
  constructor($translate, coreConfig, PciPublicGatewaysService) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.PciPublicGatewaysService = PciPublicGatewaysService;
  }

  $onInit() {
    this.isEditing = false;
    this.ovhSubsidiary = this.coreConfig.getUser().ovhSubsidiary;
    this.selectedGatewaySize = null;
  }

  onGoBackClick() {
    this.trackPublicGateways('update::back');
    this.goBack();
  }

  onGatewaySizeSelect(selectedSize) {
    this.selectedGatewaySize = selectedSize;
  }

  onNextClick() {
    this.trackPublicGateways(
      `confirm-update-public-gateway::${this.gateway.name}::${this.selectedGatewaySize.product}`,
    );
    this.isEditing = true;
    this.editModel = {
      name: this.selectedGatewaySize.product,
    };
    return this.PciPublicGatewaysService.editGateway(
      this.projectId,
      this.gateway.region,
      this.gateway.id,
      this.editModel,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_public_gateway_edit_success',
            {
              name: this.gateway.name,
            },
          ),
        );
      })
      .catch(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_public_gateway_edit_error',
            {
              name: this.gateway.name,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isEditing = false;
      });
  }
}
