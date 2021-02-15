import get from 'lodash/get';

export default class WebPaasTerminateCtrl {
  /* @ngInject */
  constructor($translate, WebPaas) {
    this.$translate = $translate;
    this.WebPaas = WebPaas;
  }

  $onInit() {
    this.isDeleting = false;
  }

  terminate() {
    this.isDeleting = true;
    return this.WebPaas.terminateProject(this.projectId)
      .then(() =>
        this.goBack(
          this.$translate.instant('web_paas_service_terminate_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('web_paas_service_terminate_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
