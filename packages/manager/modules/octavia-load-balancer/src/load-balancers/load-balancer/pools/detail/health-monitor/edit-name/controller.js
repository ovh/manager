export default class OctaviaLoadBalancerHealthMonitorEditNameCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerHealthMonitorService, Alerter, $translate) {
    this.isLoading = false;
    this.OctaviaLoadBalancerHealthMonitorService = OctaviaLoadBalancerHealthMonitorService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.name = this.healthMonitor.name;
  }

  cancel() {
    this.goToDashboard();
  }

  update() {
    this.isLoading = true;
    this.OctaviaLoadBalancerHealthMonitorService.editHealthMonitorName(
      this.projectId,
      this.region,
      this.healthMonitor,
      this.name,
    )
      .then(() => {
        return this.goToDashboard(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_health_monitor_detail_overview_edit_name_success',
            ),
            null,
            'octavia.alerts.healthmonitor',
          ),
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.healthmonitor',
        );
        this.goToDashboard();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
