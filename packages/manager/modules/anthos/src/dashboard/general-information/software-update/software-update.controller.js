export default class SoftwareUpdateController {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
    this.selectedVersion = null;
    this.isUpdating = false;
  }

  updateSoftware() {
    const {
      selectedVersion: { version },
      serviceName,
    } = this;

    this.isUpdating = true;

    this.AnthosTenantsService.updateSoftware(serviceName, version)
      .then(() => {
        const successVerbatim = this.$translate.instant(
          'anthos_tenant_dashboard_general_information_software_update_success',
        );
        this.goBack(successVerbatim, 'success');
      })
      .catch(() => {
        const errorVerbatim = this.$translate.instant(
          'anthos_tenant_dashboard_general_information_software_update_error',
        );
        this.displayAlerterMessage('error', errorVerbatim);
      })
      .finally(() => {
        this.isUpdating = false;
        this.selectedVersion = null;
      });
  }
}
