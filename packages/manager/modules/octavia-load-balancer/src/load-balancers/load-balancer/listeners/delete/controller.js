export default class OctaviaLoadBalancerDeleteCtrl {
  /* @ngInject */
  constructor(Alerter, $translate, OctaviaLoadBalancerListenersService) {
    this.isLoading = false;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerListenersService = OctaviaLoadBalancerListenersService;
  }

  cancel() {
    this.trackDeleteAction(`cancel`);
    this.goBack();
  }

  delete() {
    this.isLoading = true;
    this.trackDeleteAction(`confirm`);
    this.OctaviaLoadBalancerListenersService.deleteListener(
      this.projectId,
      this.region,
      this.listenerId,
    )
      .then(() => {
        this.trackDeletePage(`success`);
        return this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_listener_delete_success',
              { listener: this.listenerName },
            ),
            null,
            'octavia.alerts.listeners',
          ),
        );
      })
      .catch((error) => {
        this.trackDeletePage(`error`);
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data.message,
            requestId: error.config.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.listeners',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
