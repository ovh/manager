import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('backups::options_menu::restore', 'page');
  }

  restoreInstance() {
    this.trackDashboard('backups::options_menu::restore_validate');
    this.isLoading = true;
    this.service
      .restoreBackup(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.backupInstance.id,
      )
      .then(() =>
        this.goBackToDashboard(
          this.$translate.instant('pci_databases_backups_restore_success', {
            name: this.backupInstance.description,
          }),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_databases_backups_restore_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDashboard('backups::options_menu::restore_cancel');
    this.goBack();
  }
}
