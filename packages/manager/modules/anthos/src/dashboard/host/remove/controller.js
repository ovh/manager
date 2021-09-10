export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  $onInit() {
    this.trackPage(this.removeHostHitTracking);
  }

  removeHost() {
    this.trackClick(`${this.removeHostHitTracking}::confirm`);

    return this.AnthosTenantsService.terminateServiceById(
      this.hostService.serviceId,
    )
      .then(() => {
        this.goBack();
      })
      .catch((error) => {
        this.goBack(
          this.$translate.instant('anthos_dashboard_remove_host_error', {
            message: error.data?.message,
          }),
          'error',
        );
      });
  }

  onRemoveHostCancel() {
    this.trackClick(`${this.removeHostHitTracking}::cancel`);

    return this.goBack();
  }
}
