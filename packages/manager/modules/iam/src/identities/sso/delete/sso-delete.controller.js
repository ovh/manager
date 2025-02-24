export default class IamUsersSsoDeleteCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamSsoService) {
    this.$scope = $scope;
    this.ssoService = IamSsoService;
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

    this.ssoService
      .deleteIdentityProvider(this.user)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('sso_delete_success_message'),
          'iam-sso-alert',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'sso_delete_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-sso-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('sso_delete_error_message')} ${
            err.data.message
          }`,
          'iam-sso-alert',
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
