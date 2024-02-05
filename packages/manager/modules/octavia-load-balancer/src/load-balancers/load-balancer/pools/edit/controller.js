export default class OctaviaLoadBalancerPoolsEditCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerPoolsService, Alerter, $translate) {
    this.OctaviaLoadBalancerPoolsService = OctaviaLoadBalancerPoolsService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      name: this.pool.name,
      algorithm: this.pool.algorithm,
      protocol: this.pool.protocol,
      persistentSession: this.pool.sessionPersistence,
      cookieName: this.pool.sessionPersistence.cookieName,
      hasSession: this.pool.sessionPersistence.type !== 'disabled',
    };
  }

  submit() {
    this.loading = true;
    this.trackEditAction('confirm');
    const sessionPersistence = this.model.hasSession
      ? {
          type: this.model.persistentSession.value,
          cookieName: this.model.cookieName,
        }
      : { type: 'disabled' };
    this.OctaviaLoadBalancerPoolsService.editPool(
      this.projectId,
      this.region,
      this.poolId,
      this.model.name,
      this.model.algorithm.value,
      sessionPersistence,
    )
      .then(async () => {
        this.trackEditPage('success');
        return this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_pools_edit_success',
              {
                pool: this.model.name,
              },
            ),
            null,
            'octavia.alerts.pool',
          ),
        );
      })
      .catch((error) => {
        this.trackEditPage('error');
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
    this.trackEditAction('cancel');
    this.goBack();
  }
}
