import { TERMINATE_INPUT } from './terminate.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.TERMINATE_INPUT = TERMINATE_INPUT;
  }

  $onInit() {
    this.isDeleting = false;
  }

  terminate() {
    this.isDeleting = true;
    this.trackDashboard('pools::entry_menu::delete_confirm', 'action');
    return this.DatabaseService.terminateConnectionPool(
      this.projectId,
      this.databaseId,
      this.pool.id,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('pci_databases_pools_terminate_success', {
            name: this.pool.name,
          }),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_databases_pools_terminate_error', {
            message: error.data?.message || null,
            name: this.pool.name,
          }),
          'error',
        ),
      );
  }

  cancelTerminate() {
    this.trackDashboard('pools::entry_menu::delete_cancel', 'action');
    this.goBack();
  }
}
