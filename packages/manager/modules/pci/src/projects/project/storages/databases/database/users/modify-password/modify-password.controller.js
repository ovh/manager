import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  $onInit() {
    this.isLoading = false;
  }

  modifyPassword() {
    this.isLoading = true;
    return this.service
      .resetUserCredentials(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.user.id,
      )
      .then((data) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_users_modify_password_success',
            {
              user: this.user.username,
              password: data.password,
            },
          ),
        }),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_databases_users_modify_password_error', {
            user: this.user.username,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
