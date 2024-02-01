export default class OctaviaLoadBalancerPoolsDetailHealthMonitorDeleteCtrl {
  /* @ngInject */
  constructor(Alerter, OctaviaLoadBalancerHealthMonitorService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerHealthMonitorService = OctaviaLoadBalancerHealthMonitorService;
    this.$translate = $translate;
    this.isLoading = false;
  }

  cancel() {
    this.trackDeleteAction('cancel');
    this.goToDashboard();
  }

  delete() {
    this.trackDeleteAction('confirm');
    this.loading = true;
    const healthMonitorName = this.healthMonitor.name;
    const poolName = this.pool.name;
    this.OctaviaLoadBalancerHealthMonitorService.deleteHealthMonitor(
      this.projectId,
      this.region,
      this.healthMonitor.id,
    )
      .then(() => {
        this.trackDeletePage('success');
        this.goToPool(true).then(() => {
          this.isLoading = false;
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_health_monitor_detail_overview_delete_success',
              {
                healthMonitor: healthMonitorName,
                pool: poolName,
              },
            ),
            null,
            'octavia.alerts.pool',
          );
        });
      })
      .catch((error) => {
        this.trackDeletePage('error');
        this.isLoading = false;
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.healthmonitor',
        );
        this.goToDashboard();
      });
  }
}
