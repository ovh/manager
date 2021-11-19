import get from 'lodash/get';
import {
  NAME_PATTERN,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
} from '../add/add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.isEditing = false;
    this.name = this.database.description;
    this.trackDatabases('table::options_menu::rename_database');
    this.pattern = NAME_PATTERN;
    this.minNameLength = MIN_NAME_LENGTH;
    this.maxNameLength = MAX_NAME_LENGTH;
  }

  edit() {
    this.trackDatabases('table::options_menu::rename_database_validate');
    this.isEditing = true;
    return this.DatabaseService.editDatabase(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.name,
      this.database.plan,
      this.database.version,
      this.database.flavor.name,
    )
      .then(() =>
        this.goBack(this.$translate.instant('pci_databases_edit_name_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_databases_edit_name_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDatabases('table::options_menu::rename_database_cancel');
    this.goBack();
  }
}
