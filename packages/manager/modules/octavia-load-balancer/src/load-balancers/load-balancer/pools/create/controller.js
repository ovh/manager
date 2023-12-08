export default class OctaviaLoadBalancerPoolsCreateCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerPoolsService, Alerter, $translate) {
    this.OctaviaLoadBalancerPoolsService = OctaviaLoadBalancerPoolsService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      name: '',
      algorithm: null,
      protocol: null,
      persistentSession: null,
      cookieName: '',
      hasSession: false,
    };
  }

  submit() {
    this.loading = true;
    this.trackCreateAction('confirm');
    this.OctaviaLoadBalancerPoolsService.createPool(
      this.projectId,
      this.region,
      this.loadbalancerId,
      this.model.name,
      this.model.algorithm.value,
      this.model.protocol,
      this.model.persistentSession?.value,
      this.model.cookieName,
    )
      .then(async () => {
        this.trackCreatePage('success');
        return this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_pools_create_success',
              {
                pool: this.model.name,
              },
            ),
            null,
            'octavia.alerts.pools',
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
          'octavia.alerts.pools',
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
