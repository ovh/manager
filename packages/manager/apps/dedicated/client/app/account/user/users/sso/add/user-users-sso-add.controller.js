export default class UserAccountUsersSsoAddCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, UseraccountUsersService) {
    this.$scope = $scope;
    this.usersService = UseraccountUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = {
      group: 'DEFAULT',
    };
    this.loader = false;
    this.identityProvider = {
      metadata: null,
      groupAttributeName: null,
      disableUsers: false,
    };
  }

  $onInit() {
    this.$scope.addSso = this.addSso.bind(this);
    this.enableLocalUsers = true;
  }

  addSso() {
    this.loader = true;
    this.identityProvider.disableUsers = !this.enableLocalUsers;

    this.usersService
      .addIdentityProvider(this.identityProvider)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('user_users_sso_add_success_message'),
          'userUsers',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_sso_add_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'userUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_sso_add_error_message')} ${
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
