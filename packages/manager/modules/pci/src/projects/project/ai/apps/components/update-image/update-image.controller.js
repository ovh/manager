import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isUpdating = false;
    this.imageName = this.app.spec.image;
  }

  updateAppImage() {
    this.trackApps(`${this.trackingPrefix}::update_app_image_confirm`);
    this.isUpdating = true;
    return this.AppService.updateAppImage(
      this.projectId,
      this.app.id,
      this.imageName,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('pci_app_update_app_image_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_app_update_app_image_error', {
            appName: this.app.name,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackApps(`${this.trackingPrefix}::update_app_image_cancel`);
    this.goBack();
  }
}
