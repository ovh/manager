export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  reinstallHost() {
    this.trackClick(`${this.reinstallHostHitTracking}::confirm`);
    this.isLoading = true;

    return this.AnthosTenantsService.reinstallHost(
      this.serviceName,
      this.host.id,
    )
      .then((hostData) => {
        this.host.update(hostData);
        this.goBack();
      })
      .catch((error) => {
        this.goBack(
          this.$translate.instant('anthos_dashboard_reinstall_host_error', {
            message: error.data?.message,
          }),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onReinstallHostCancel() {
    this.trackClick(`${this.reinstallHostHitTracking}::cancel`);

    return this.goBack();
  }
}
