import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  $onInit() {
    this.isLoading = false;
    this.trackDashboard('allowed-ips::options::delete', 'page');
  }

  deleteIp() {
    this.trackDashboard('allowed-ips::options::delete_ips_confirm');
    this.isLoading = true;
    return this.service
      .deleteRestrictedIp(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.ipToDelete.ip,
      )
      .then(() => {
        this.trackDashboard('allowed-ips::options::delete_ips_validate');
        this.goBack(
          this.$translate.instant('pci_databases_allowed_ips_delete_success'),
        );
      })
      .catch((error) => {
        this.trackDashboard('allowed-ips::options::delete_ips_error');
        this.goBack(
          this.$translate.instant('pci_databases_allowed_ips_delete_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        );
      });
  }

  cancel() {
    this.trackDashboard('allowed-ips::options::delete_ips_cancel');
    this.goBack();
  }
}
