export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  removeHost() {
    this.AnthosTenantsService.terminateServiceById(this.hostService.serviceId)
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
}
