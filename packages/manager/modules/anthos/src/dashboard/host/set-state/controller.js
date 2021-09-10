export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  $onInit() {
    this.trackPage(this.setStateHitTracking);

    this.isStateful = this.host.stateful;
  }

  setState() {
    this.trackClick(
      `${this.setStateHitTracking}::confirm_${
        this.isStateful ? 'statefull' : 'stateless'
      }`,
    );

    return this.AnthosTenantsService.setHostState(
      this.serviceName,
      this.host.id,
      this.isStateful,
    )
      .then((hostData) => {
        this.host.update(hostData);
        this.goBack();
      })
      .catch((error) => {
        this.goBack(
          this.$translate.instant('anthos_dashboard_set_state_host_error', {
            message: error.data?.message,
          }),
          'error',
        );
      });
  }

  onSetStateCancel() {
    this.trackClick(`${this.setStateHitTracking}::cancel`);

    return this.goBack();
  }
}
