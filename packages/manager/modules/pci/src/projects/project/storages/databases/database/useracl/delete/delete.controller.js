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
    this.trackDashboard('acl_user::delete_rule', 'page');
    this.aclToDelete = [];
  }

  cancel() {
    this.trackDashboard('acl_user::delete_rule_cancel');
    this.goBack();
  }

  onRowSelect(row, rows) {
    this.aclToDelete = rows;
  }

  deleteUserAcl() {
    this.processing = true;
    this.trackDashboard('acl_user::delete_rule_validate');
    return this.DatabaseService.editUserAcl(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.user.acls.filter(
        (a) =>
          !this.aclToDelete.find(
            (b) => a.permission === b.permission && a.pattern === b.pattern,
          ),
      ),
      this.user.id,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_useracl_delete_success_message',
            {
              username: this.user.username,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_useracl_delete_error_message',
            {
              username: this.user.username,
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
