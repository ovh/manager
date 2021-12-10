import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.processing = false;
    this.trackDatabases('table::options_menu::delete_database', 'page');
  }

  deleteService() {
    this.trackDatabases('table::options_menu::delete_database_validate');
    this.processing = true;
    return this.DatabaseService.deleteDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_database_confirm_delete_success_message',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_database_confirm_delete_error_message', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDatabases('table::options_menu::delete_database_cancel');
    this.goBack();
  }
}
