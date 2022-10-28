import get from 'lodash/get';

export default class UserAccountUsersSsoUpdateCtrl {
  /* @ngInject */
  constructor($scope, UseraccountUsersService, Alerter, $translate) {
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
    };
    this.newGroupAttributeName = '';
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

    this.usersService
      .updateIdentityProvider(this.identityProvider)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('user_users_sso_update_success_message', {
            login: this.user.login,
          }),
          'userUsers',
        );
      })
      .catch((err) => {
        return this.alerter.error(
          `${this.$translate.instant(
            'user_users_sso_update_error_message',
          )} ${get(err, 'message', err)}`,
          'userUsers',
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
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }
}
