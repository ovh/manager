import get from 'lodash/get';

export default class UserAccountUsersSSODeleteCtrl {
  /* @ngInject */
  constructor($scope, UseraccountUsersService, Alerter, $translate) {
    this.$scope = $scope;
    this.usersService = UseraccountUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = $scope.currentActionData;
    this.loader = false;
  }

  $onInit() {
    this.$scope.deleteSSO = this.deleteSSO.bind(this);
  }

  deleteSSO() {
    this.loader = true;

    this.usersService
      .deleteIdentityProvider(this.user)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('user_users_sso_delete_success_message'),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant(
            'user_users_sso_delete_error_message',
          )} ${get(err, 'message', err)}`,
          'userUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
