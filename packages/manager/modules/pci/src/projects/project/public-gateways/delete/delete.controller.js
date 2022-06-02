export default class PciPublicGatewaysDeleteController {
  /* @ngInject */
  constructor($translate, PciPublicGatewaysService) {
    this.$translate = $translate;
    this.PciPublicGatewaysService = PciPublicGatewaysService;
  }

  $onInit() {
    this.isDeleting = false;
    this.deleteTrackPrefix = 'delete::';
  }

  onCancel() {
    this.trackPublicGateways(`${this.deleteTrackPrefix}cancel`);
    this.goBack();
  }

  deleteGateway() {
    this.trackPublicGateways(`${this.deleteTrackPrefix}confirm`);
    this.isDeleting = true;
    return this.PciPublicGatewaysService.deleteGateway(
      this.projectId,
      this.gateway.region,
      this.gateway.id,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_public_gateway_delete_success',
            {
              name: this.gateway.name,
            },
          ),
        );
      })
      .catch(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_public_gateway_delete_error',
            {
              name: this.gateway.name,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isDeleting = false;
      });
  }
}
