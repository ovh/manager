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

  delete() {
    this.isLoading = true;
    return this.webPaasService
      .deleteUser(this.projectId, this.customer.customerId)
      .then(() =>
        this.goBack(
          this.$translate.instant('web_paas_user_licences_delete_user_success'),
          'success',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('web_paas_user_licences_delete_user_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
