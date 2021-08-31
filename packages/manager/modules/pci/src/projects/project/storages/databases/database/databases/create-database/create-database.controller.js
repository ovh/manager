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
    this.trackDatabases(
      'dashboard::general_information::upgrade_version',
      'page',
    );
  }

  cancel() {
    this.goBack();
  }

  addDatabase() {
    // this.trackDatabases('dashboard::users::add_a_user::define_role_validate');
    this.processing = true;
    return this.DatabaseService.addServiceDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.databaseName,
    )
      .then((database) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_databases_create_database_success_message',
            {
              database,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_databases_create_database_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
