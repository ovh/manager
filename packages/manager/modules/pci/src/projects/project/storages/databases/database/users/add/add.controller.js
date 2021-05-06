import get from 'lodash/get';
import map from 'lodash/map';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.availableRoles = [...this.roles];
    this.model = {
      username: '',
      password: '',
      selectedRoles: [],
    };
  }

  addUser() {
    this.trackDatabases('dashboard::users::add_a_user::define_role_validate');
    this.processing = true;
    return this.DatabaseService.addUser(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.model.username,
      this.model.password,
      map(this.model.selectedRoles, 'id'),
    )
      .then(({ username }) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_users_add_success_message',
            {
              username,
              password: this.model.password,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant('pci_databases_users_add_error_save', {
            message: get(err, 'data.message', null),
          }),
          'error',
        ),
      );
  }

  cancel(trackingCode) {
    this.trackDatabases(trackingCode);
    this.goBack();
  }
}
