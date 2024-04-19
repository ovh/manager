export default class IamUsersSsoUpdateCtrl {
  /* @ngInject */
  constructor($scope, IamUsersService, Alerter, $translate) {
    this.$scope = $scope;
    this.usersService = IamUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = {
      group: 'DEFAULT',
    };
    this.loader = false;
    this.identityProvider = {
      metadata: null,
      userAttributeName: null,
      groupAttributeName: null,
      disableUsers: false,
    };
    this.newGroupAttributeName = '';
    this.newUserAttributeName = '';
    this.enableLocalUsers = true;
  }

  $onInit() {
    this.$scope.updateSso = this.updateSso.bind(this);
    this.initIdentityProvider();
  }

  updateSso() {
    this.loader = true;

    if (this.identityProvider == null) {
      return;
    }

    this.identityProvider.groupAttributeName = this.newGroupAttributeName;
    this.identityProvider.userAttributeName = this.newUserAttributeName;
    this.identityProvider.disableUsers = !this.enableLocalUsers;

    this.usersService
      .updateIdentityProvider(this.identityProvider)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('user_users_sso_update_success_message', {
            login: this.user.login,
          }),
          'iamUsers',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_sso_update_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iamUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_sso_update_error_message')} ${
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

  initIdentityProvider() {
    this.usersService
      .getIdentityProvider()
      .then((identityProvider) => {
        this.identityProvider = identityProvider;
        this.newGroupAttributeName = this.identityProvider.groupAttributeName;
        this.newUserAttributeName = this.identityProvider.userAttributeName;
        this.enableLocalUsers = !this.identityProvider.disableUsers;
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }

  close() {
    this.$scope.resetAction();
  }
}
