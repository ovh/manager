import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isStopping = false;
  }

  stopComponentApp() {
    this.trackApps(`${this.trackingPrefix}::stop_app_confirm`);
    this.isStopping = true;
    return this.AppService.stopApp(this.projectId, this.app.id)
      .then(() =>
        this.goBack(this.$translate.instant('pci_app_stop_app_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_app_stop_app_error', {
            appName: this.app.name,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackApps(`${this.trackingPrefix}::stop_app_cancel`);
    this.goBack();
  }
}
