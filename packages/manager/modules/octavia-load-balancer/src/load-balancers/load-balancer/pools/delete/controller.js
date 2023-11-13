export default class OctaviaLoadBalancerPoolDeleteCtrl {
  /* @ngInject */
  constructor(Alerter, $translate, OctaviaLoadBalancerPoolsService) {
    this.isLoading = false;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerPoolsService = OctaviaLoadBalancerPoolsService;
  }

  cancel() {
    this.trackDeleteAction(`cancel`);
    this.goBack();
  }

  delete() {
    this.isLoading = true;
    this.trackDeleteAction(`confirm`);
    this.OctaviaLoadBalancerPoolsService.deletePool(
      this.projectId,
      this.region,
      this.poolId,
    )
      .then(() => {
        this.trackDeletePage(`success`);
        this.Alerter.set(
          'alert-success',
          this.$translate.instant('octavia_load_balancer_pool_delete_success', {
            pool: this.poolName,
          }),
          null,
          'octavia.alerts.global',
        );
        this.goBack(true);
      })
      .catch((error) => {
        this.trackDeletePage(`error`);
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
