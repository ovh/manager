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

  deleteComponentApp() {
    this.trackApps(`${this.trackingPrefix}::delete_app_confirm`);
    this.isDeleting = true;
    return this.AppService.deleteApp(this.projectId, this.app.id)
      .then(() =>
        this.goBack(this.$translate.instant('pci_ai_apps_delete_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_ai_apps_delete_error', {
            appName: this.app.name,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
