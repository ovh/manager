import remove from 'lodash/remove';
import get from 'lodash/get';
import { ADD_USER_ACL_FORM } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.inputRules = ADD_USER_ACL_FORM;
  }

  $onInit() {
    this.trackDashboard('acl::create_acl_user', 'page');
    this.rules = [];
  }

  cancel() {
    this.trackDashboard('acl_user::create_acl_user_cancel');
    this.goBack();
  }

  onAdd(form) {
    this.rules.push({
      permission: form.permission.$modelValue,
      pattern: form.pattern.$modelValue,
    });
  }

  onRemove(form) {
    remove(
      this.rules,
      (r) =>
        r.permission === form.permission.$modelValue &&
        r.pattern === form.pattern.$modelValue,
    );
  }

  addUserAcl() {
    this.processing = true;
    this.user.acls = this.user.acls.concat(this.rules);
    this.trackDashboard('acl_user::create_acl_user_validate');
    return this.DatabaseService.editUser(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.user,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_useracl_create_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_useracl_create_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
