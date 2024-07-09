export default class IamUsersSsoDeleteCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamUsersService) {
    this.$scope = $scope;
    this.usersService = IamUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = $scope.currentActionData;
    this.loader = false;
  }

  $onInit() {
    this.$scope.deleteSso = this.deleteSso.bind(this);
  }

  deleteSso() {
    this.loader = true;

    this.usersService
      .deleteIdentityProvider(this.user)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('user_users_sso_delete_success_message'),
          'iamUsers',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_sso_delete_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iamUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_sso_delete_error_message')} ${
            err.data.message
          }`,
          'iamUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }

  close() {
    this.$scope.resetAction();
  }
}
