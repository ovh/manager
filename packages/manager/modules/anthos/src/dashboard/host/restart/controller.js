export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  $onInit() {
    this.trackPage(this.restartHostHitTracking);
  }

  restartHost() {
    this.trackClick(`${this.restartHostHitTracking}::confirm`);

    return this.AnthosTenantsService.restartHost(this.serviceName, this.host.id)
      .then((hostData) => {
        this.host.update(hostData);
        this.goBack();
      })
      .catch((error) => {
        this.goBack(
          this.$translate.instant('anthos_dashboard_restart_host_error', {
            message: error.data?.message,
          }),
          'error',
        );
      });
  }

  onRestartHostCancel() {
    this.trackClick(`${this.restartHostHitTracking}::cancel`);

    return this.goBack();
  }
}
