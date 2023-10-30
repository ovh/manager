export default class OctaviaLoadBalancerDeleteCtrl {
  /* @ngInject */
  constructor(Alerter, $translate, OctaviaLoadBalancerListenersService) {
    this.isLoading = false;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerListenersService = OctaviaLoadBalancerListenersService;
  }

  cancel() {
    this.trackAction(`cancel`);
    this.goBack();
  }

  delete() {
    this.isLoading = true;
    this.trackAction(`confirm`);
    this.OctaviaLoadBalancerListenersService.deleteListener(
      this.projectId,
      this.region,
      this.listenerId,
    )
      .then(() => {
        this.trackPage(`success`);
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_listener_delete_success',
            { listener: this.listenerName },
          ),
          null,
          'octavia.alerts.global',
        );
        this.goBack(true);
      })
      .catch((error) => {
        this.trackPage(`error`);
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data.message,
            requestId: error.config.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.global',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
