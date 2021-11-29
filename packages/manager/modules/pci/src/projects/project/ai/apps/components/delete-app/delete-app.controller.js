import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deletAapp() {
    this.trackApps(`${this.trackingPrefix}::delete_app_confirm`);
    this.isDeleting = true;
    return this.AppService.removeApp(this.projectId, this.app.id)
      .then(() =>
        this.goBack(this.$translate.instant('pci_app_delete_app_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_app_delete_app_error', {
            appName: this.app.name,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackApps(`${this.trackingPrefix}::delete_app_cancel`);
    this.goBack();
  }
}
