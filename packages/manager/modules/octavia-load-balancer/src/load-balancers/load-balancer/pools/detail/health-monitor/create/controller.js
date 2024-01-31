export default class OctaviaLoadBalancerPoolsDetailHealthMonitorCreateCtrl {
  /* @ngInject */
  constructor(Alerter, OctaviaLoadBalancerHealthMonitorService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerHealthMonitorService = OctaviaLoadBalancerHealthMonitorService;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;

    this.model = {
      maxRetriesDown: 3,
      delay: 5,
      maxRetries: 4,
      timeout: 4,
    };
  }

  createHealthMonitor() {
    this.loading = true;
    this.OctaviaLoadBalancerHealthMonitorService.createHealthMonitor(
      this.projectId,
      this.region,
      this.pool.id,
      this.model,
    )
      .then(() => {
        this.goToDashboard(true).then(() => {
          this.loading = false;
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_health_monitor_create_success',
              { name: this.model.name },
            ),
            null,
            'octavia.alerts.healthmonitor',
          );
        });
      })
      .catch((error) => {
        this.loading = false;
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.healthmonitor',
        );
      });
  }
}
