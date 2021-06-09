import get from 'lodash/get';

export default class WebPaasTerminateCtrl {
  /* @ngInject */
  constructor($translate, WebPaas, atInternet) {
    this.$translate = $translate;
    this.WebPaas = WebPaas;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.isDeleting = false;
  }

  terminate() {
    this.atInternet.trackClick({
      name: 'web-paas::projects-table::options::cancel-project-confirmation',
      type: 'action',
    });
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

  cancel() {
    this.atInternet.trackClick({
      name: 'web-paas::projects-table::options::cancel-project-cancel',
      type: 'action',
    });
    return this.goBack();
  }
}
