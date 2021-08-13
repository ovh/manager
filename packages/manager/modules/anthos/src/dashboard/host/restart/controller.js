export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  restartHost() {
    this.AnthosTenantsService.restartHost(this.serviceName, this.host.id)
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
}
