import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, WebPaas) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.webPaasService = WebPaas;
  }

  $onInit() {
    this.isLoading = false;
  }

  invite() {
    this.atInternet.trackClick({
      name: `${this.webPaasUserLicencesTrackingPrefix}invite-user-confirm`,
      type: 'action',
    });
    this.isLoading = true;
    return this.webPaasService
      .inviteUser(this.projectId, this.accountName)
      .then(() =>
        this.goBack(
          this.$translate.instant('web_paas_user_licences_invite_user_success'),
          'success',
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant(
            'web_paas_user_licences_invite_user_error',
          )} ${get(error, 'data.message')}`,
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.webPaasUserLicencesTrackingPrefix}invite-user-cancel`,
      type: 'action',
    });
    return this.goBack();
  }
}
