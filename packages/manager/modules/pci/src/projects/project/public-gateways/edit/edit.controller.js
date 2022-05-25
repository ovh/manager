export default class PciPublicGatewaysEditController {
  /* @ngInject */
  constructor($translate, PciPublicGatewaysService) {
    this.$translate = $translate;
    this.PciPublicGatewaysService = PciPublicGatewaysService;
  }

  $onInit() {
    this.isEditing = false;
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
