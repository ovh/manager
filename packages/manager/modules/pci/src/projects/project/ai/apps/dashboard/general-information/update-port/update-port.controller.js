export default class AIDashboadUpdateAppPortCtrl {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isUpdating = false;
    this.httpPort = this.app.spec.defaultHttpPort;
  }

  updateAppPort() {
    this.trackApps(`${this.trackingPrefix}::update_app_port_confirm`);
    this.isUpdating = true;
    return this.AppService.updateAppHttpPort(
      this.projectId,
      this.app.id,
      this.httpPort,
    )
      .then(() =>
        this.goBack(this.$translate.instant('pci_app_update_app_port_success')),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant('pci_app_update_app_port_error', {
            message: err.data?.message || null,
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackApps(`${this.trackingPrefix}::update_app_port_cancel`);
    this.goBack();
  }
}
