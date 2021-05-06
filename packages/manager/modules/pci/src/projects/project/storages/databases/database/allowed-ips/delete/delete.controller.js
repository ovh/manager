import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteIp() {
    this.trackDatabases('dashboard::allowed-ips::options::delete_ips_confirm');
    this.isLoading = true;
    return this.service
      .deleteRestrictedIp(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.ipToDelete.ip,
      )
      .then(() => {
        this.trackDatabases(
          'dashboard::allowed-ips::options::delete_ips_validate',
        );
        this.goBack(
          this.$translate.instant('pci_databases_allowed_ips_delete_success'),
        );
      })
      .catch((error) => {
        this.trackDatabases(
          'dashboard::allowed-ips::options::delete_ips_error',
        );
        this.goBack(
          this.$translate.instant('pci_databases_allowed_ips_delete_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackDatabases('dashboard::allowed-ips::options::delete_ips_cancel');
    this.goBack();
  }
}
