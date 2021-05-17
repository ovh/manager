import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, WebPaas) {
    this.$translate = $translate;
    this.webPaasService = WebPaas;
  }

  $onInit() {
    this.isLoading = false;
  }

  invite() {
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
}
