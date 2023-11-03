export default class OctaviaLoadBalancerListenerEditionCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerListenersService, Alerter, $translate) {
    this.OctaviaLoadBalancerListenersService = OctaviaLoadBalancerListenersService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      name: this.listener.name,
      port: this.listener.port,
      protocol: this.listener.protocol,
      pool: this.pools.find((pool) => pool.id === this.listener.defaultPoolId),
    };
  }

  submit() {
    this.loading = true;
    this.trackEditAction('confirm');
    this.OctaviaLoadBalancerListenersService.editListener(
      this.projectId,
      this.region,
      this.listener.id,
      this.model.name,
      this.model.pool?.id,
    )
      .then(async () => {
        this.trackEditPage('success');
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_listeners_create_success',
            { listener: this.model.name },
          ),
          null,
          'octavia.alerts.global',
        );
        await this.goBack(true);
      })
      .catch((error) => {
        this.trackEditPage('error');
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.global',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.trackEditAction('cancel');
    this.goBack();
  }
}
