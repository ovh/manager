import get from 'lodash/get';

export default class UserAccountUsersSSOUpdateCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    UseraccountUsersService,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.usersService = UseraccountUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = {
      group: 'DEFAULT',
    };
    this.loader = false;
    this.identityProvider = {
      metadata: null,
      groupAttributeName: null,
    };
  }

  $onInit() {
    this.$scope.updateSSO = this.updateSSO.bind(this);
    this.initIdentityProvider();
  }

  updateSSO() {
    this.loader = true;

    this.usersService
      .updateIdentityProvider(this.identityProvider)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('user_users_sso_update_success_message', {
            login: this.user.login,
          }),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
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
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }
}
