import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isStarting = false;
  }

  startComponentApp() {
    this.trackApps(`${this.trackingPrefix}::start_app_confirm`);
    this.isStarting = true;
    return this.AppService.startApp(this.projectId, this.app.id)
      .then(() =>
        this.goBack(this.$translate.instant('pci_app_start_app_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_app_start_app_error', {
            appName: this.app.name,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackApps(`${this.trackingPrefix}::start_app_cancel`);
    this.goBack();
  }
}
