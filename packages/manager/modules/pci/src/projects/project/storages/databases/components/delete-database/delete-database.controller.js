import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteDatabase() {
    this.trackDatabases(
      `${this.trackingPrefix}::${this.database.engine}::delete_database_validate`,
    );
    this.isDeleting = true;
    return this.DatabaseService.deleteDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('pci_database_delete_database_success', {
            databaseName: this.database.description,
          }),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_database_delete_database_error', {
            databaseName: this.database.description,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDatabases(`${this.trackingPrefix}::delete_database_cancel`);
    this.goBack();
  }
}
