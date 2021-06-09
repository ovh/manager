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

  cancel() {
    this.atInternet.trackClick({
      name:
        'web-paas::project-user-license::user-table-options::delete-user-cancel',
      type: 'action',
    });
    return this.goBack();
  }

  delete() {
    this.atInternet.trackClick({
      name:
        'web-paas::project-user-license::user-table-options::delete-user-confirm',
      type: 'action',
    });
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
