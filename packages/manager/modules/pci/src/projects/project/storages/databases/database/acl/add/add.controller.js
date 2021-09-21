import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('acl::add', 'page');
    this.DatabaseService.getPermissions(
      this.projectId,
      this.database.engine,
      this.database.id,
    ).then((permissions) => {
      this.availablePermissions = permissions.names;
    });
  }

  cancel() {
    this.goBack();
  }

  addAcl() {
    this.trackDashboard('acl::add::add_an_acl_validate');
    this.processing = true;
    return this.DatabaseService.addServiceAcl(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.username,
      this.topic,
      this.permission,
    )
      .then((acl) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_acl_add_success_message',
            {
              username: acl.username,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant('pci_databases_acl_add_error_message', {
            message: get(err, 'data.message', null),
          }),
          'error',
        ),
      );
  }
}
