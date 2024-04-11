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
    this.gatewayDetails = null;
    this.fetchGatewayDetails();
  }

  onGoBackClick() {
    this.trackPublicGateways('update::back');
    this.goBack();
  }

  onGatewaySizeSelect(selectedSize) {
    this.selectedGatewaySize = selectedSize;
  }

  fetchGatewayDetails() {
    return this.PciPublicGatewaysService.fetchGatewayDetails(
      this.projectId,
      this.region,
      this.gatewayId,
    )
      .then((data) => {
        this.gatewayDetails = data;
        return this.gatewayDetails;
      })
      .catch((err) => this.CucCloudMessage.error(err.data.message || err.data));
  }

  onNextClick() {
    this.trackClick(
      `confirm-update-public-gateway::publiccloud-gateway-${this.gatewayDetails.model}::${this.selectedGatewaySize.product}`,
    );
    this.isEditing = true;
    this.editModel = {
      model: this.selectedGatewaySize.model,
      name: this.gatewayDetails.name,
    };
    return this.PciPublicGatewaysService.editGateway(
      this.projectId,
      this.region,
      this.gatewayId,
      this.editModel,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_public_gateway_edit_success',
            {
              name: this.gatewayDetails.name,
            },
          ),
        );
      })
      .catch(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_public_gateway_edit_error',
            {
              name: this.gatewayDetails.name,
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
