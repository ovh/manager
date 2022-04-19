import get from 'lodash/get';
import { DATABASE_TYPES } from '../../../databases.constants';
import { ADD_USER_FORM_RULES } from './add.constants';

export default class AddUserCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.inputRules = ADD_USER_FORM_RULES;
    this.checkPattern = AddUserCtrl.checkPattern;
  }

  $onInit() {
    this.trackDashboard('users::add_a_user', 'page');
    this.availableRoles = [...this.roles];
    this.model = {
      username: '',
      password: '',
      group: '',
      categories: [],
      channels: [],
      commands: [],
      keys: [],
      selectedRoles: [],
    };
    this.isRolesReadOnly = !this.isFeatureActivated('getRoles');
    this.hasGroups = this.isFeatureActivated('usersGroup');
    if (this.isRolesReadOnly) {
      this.model.selectedRoles = [];
    }
  }

  static checkPattern(value, pattern) {
    return pattern.test(value);
  }

  getUserFromModel() {
    const user = {
      name: this.model.username,
    };
    if (this.database.engine === DATABASE_TYPES.REDIS) {
      user.categories = this.model.categories;
      user.channels = this.model.channels;
      user.commands = this.model.commands;
      user.keys = this.model.keys;
    }
    if (this.isFeatureActivated('getRoles')) {
      user.roles = this.model.selectedRoles.map((role) => role.name);
    }
    if (this.hasGroups && this.model.group) {
      user.group = this.model.group;
    }
    return user;
  }

  addUser() {
    if (this.model.username) {
      this.trackDashboard('users::add_a_user::validate');
      this.processing = true;
      this.DatabaseService.addUser(
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
              message: get(err, 'data.message', null).replace(/"/g, ''),
            }),
            'error',
          ),
        );
    }
  }

  cancel() {
    this.trackDashboard('users::add_a_user::cancel');
    this.goBack();
  }
}
