export default class UserAccountUsersSsoDeleteCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, UseraccountUsersService) {
    this.$scope = $scope;
    this.usersService = UseraccountUsersService;
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
          'userUsers',
        );
      })
      .catch((err) => {
        return this.alerter.error(
          `${this.$translate.instant('user_users_sso_delete_error_message')} ${
            err.data.message
          }`,
          'userUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
