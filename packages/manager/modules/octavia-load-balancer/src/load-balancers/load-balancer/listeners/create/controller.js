export default class OctaviaLoadBalancerListenersCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerListenersService, Alerter, $translate) {
    this.OctaviaLoadBalancerListenersService = OctaviaLoadBalancerListenersService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      name: '',
      port: null,
      protocol: null,
      pool: null,
    };
  }

  submit() {
    this.loading = true;
    this.trackCreateAction('confirm');
    this.OctaviaLoadBalancerListenersService.createListener(
      this.projectId,
      this.region,
      this.loadbalancerId,
      this.model.name,
      this.model.protocol,
      this.model.port,
      this.model.pool?.id,
    )
      .then(async () => {
        this.trackCreatePage('success');
        await this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_listeners_create_success',
              { listener: this.model.name },
            ),
            null,
            'octavia.alerts.listeners',
          ),
        );
      })
      .catch((error) => {
        this.trackCreatePage('error');
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.listeners',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.trackCreateAction('cancel');
    this.goBack();
  }
}
