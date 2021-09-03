import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.isEditing = false;
    this.name = this.database.description;
  }

  edit() {
    this.trackDashboard('general_information::modify_name_validate');
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
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_edit_name_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_edit_name_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDashboard('general_information::modify_name_cancel');
    this.goBack();
  }
}
