import get from 'lodash/get';
import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('database::delete', 'page');
  }

  cancel() {
    this.goBack();
  }

  deleteDatabase() {
    this.processing = true;
    this.trackDashboard('database::delete_validate');
    return this.DatabaseService.deleteServiceDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.dbInstance,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_databases_delete_database_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_databases_delete_database_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
