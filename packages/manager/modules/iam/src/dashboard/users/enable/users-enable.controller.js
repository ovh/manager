export default class IamUsersEnableCtrl {
  /* @ngInject */
  constructor($scope, IamUsersService, Alerter, $translate) {
    this.$scope = $scope;
    this.usersService = IamUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = $scope.currentActionData;
    this.loader = false;
  }

  $onInit() {
    this.$scope.enableUser = this.enableUser.bind(this);
  }

  enableUser() {
    this.loader = true;

    this.usersService
      .enableUser(this.user)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('user_users_enable_success_message', {
            login: this.user.login,
          }),
          'iamUsers',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_enable_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iamUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_enable_error_message')} ${
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
