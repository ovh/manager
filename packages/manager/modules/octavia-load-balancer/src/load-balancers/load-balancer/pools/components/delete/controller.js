export default class OctaviaLoadBalancerPoolsDeleteCtrl {
  /* @ngInject */
  constructor($state, Alerter, $translate, OctaviaLoadBalancerPoolsService) {
    this.$state = $state;
    this.isLoading = false;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerPoolsService = OctaviaLoadBalancerPoolsService;
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
          this.$translate.instant(
            'octavia_load_balancer_pools_components_delete_success',
            {
              pool: this.poolName,
            },
          ),
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
            requestId: error.headers('x-ovh-queryId'),
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
