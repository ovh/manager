import get from 'lodash/get';

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
    this.isRolesReadOnly = !this.isFeatureActivated('getRoles');
    if (this.isRolesReadOnly) {
      this.model.selectedRoles.push(this.availableRoles[0]);
    }
  }

  getUserFromModel() {
    const user = {};
    if (this.database.engine === 'redis') {
      user.categories = [];
      user.channels = [];
      user.commands = [];
      user.keys = [];
      user.username = this.model.username;
    } else {
      user.name = this.model.username;
      user.roles = this.model.selectedRoles.map((role) => role.name);
    }
    return user;
  }

  addUser() {
    this.trackDatabases('dashboard::users::add_a_user::define_role_validate');
    this.processing = true;
    return this.DatabaseService.addUser(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.getUserFromModel(),
    )
      .then((createdUser) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_users_add_success_message',
            {
              username: createdUser.username,
              password: createdUser.password,
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
