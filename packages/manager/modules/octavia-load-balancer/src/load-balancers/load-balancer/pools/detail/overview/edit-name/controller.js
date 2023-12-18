export default class OctaviaLoadBalancerEditNameCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerPoolsService, Alerter, $translate) {
    this.isLoading = false;
    this.OctaviaLoadBalancerPoolsService = OctaviaLoadBalancerPoolsService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.name = this.pool.name;
  }

  cancel() {
    this.trackNameEditionAction('cancel');
    this.goBack();
  }

  update() {
    this.isLoading = true;
    this.trackNameEditionAction('confirm');
    this.OctaviaLoadBalancerPoolsService.editPool(
      this.projectId,
      this.region,
      this.pool.id,
      this.name,
    )
      .then(() => {
        return this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_pools_detail_overview_edit_name_success',
            ),
            null,
            'octavia.alerts.pool',
          ),
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.pool',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
