import { SSO_TRACKING_HITS } from '../sso.constants';

export default class IamUsersSsoDeleteCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamSsoService) {
    this.$scope = $scope;
    this.ssoService = IamSsoService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.loader = false;
  }

  $onInit() {
    this.$scope.deleteSso = this.deleteSso.bind(this);
    this.$scope.trackPage(SSO_TRACKING_HITS.DELETE_SSO_MODAL);
  }

  deleteSso() {
    this.$scope.trackClick(SSO_TRACKING_HITS.DELETE_SSO_CONFIRM);
    this.loader = true;

    this.ssoService
      .deleteIdentityProvider()
      .then(() => {
        this.$scope.trackPage(SSO_TRACKING_HITS.DELETE_SSO_SUCCESS);
        return this.alerter.success(
          this.$translate.instant('sso_delete_success_message'),
          'iam-sso-alert',
        );
      })
      .catch((err) => {
        this.$scope.trackPage(SSO_TRACKING_HITS.DELETE_SSO_ERROR);
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
    this.$scope.trackClick(SSO_TRACKING_HITS.DELETE_SSO_CANCEL);
    this.$scope.resetAction();
  }
}
