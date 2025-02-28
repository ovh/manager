export default class IamUsersSsoUpdateCtrl {
  /* @ngInject */
  constructor($scope, IamSsoService, Alerter, $translate) {
    this.$scope = $scope;
    this.ssoService = IamSsoService;
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

    this.ssoService
      .updateIdentityProvider(this.identityProvider)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('sso_update_success_message'),
          'iam-sso-alert',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'sso_update_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-sso-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('sso_update_error_message')} ${
            err.message
          }`,
          'iam-sso-alert',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }

  initIdentityProvider() {
    this.ssoService
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
