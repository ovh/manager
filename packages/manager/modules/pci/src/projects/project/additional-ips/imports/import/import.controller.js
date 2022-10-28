const MESSAGES_CONTAINER_NAME = 'pci.projects.project.additional-ips';

export default class AdditionalIpImportsImportController {
  /* @ngInject */
  constructor($state, $stateParams, $translate, CucCloudMessage, OvhApiIp) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiIp = OvhApiIp;

    this.projectId = $stateParams.projectId;
    this.serviceName = $stateParams.serviceName;

    this.isLoading = false;
  }

  goBack() {
    this.$state.go('^');
  }

  import() {
    this.isLoading = true;

    return this.OvhApiIp.v6()
      .move({ ip: this.serviceName }, { to: this.projectId })
      .$promise.then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_additional_ips_imports_import_success', {
            ip: this.serviceName,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_additional_ips_imports_import_error', {
            ip: this.serviceName,
            error: data.message,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => {
        this.$state.go('pci.projects.project.additional-ips');
      });
  }
}
