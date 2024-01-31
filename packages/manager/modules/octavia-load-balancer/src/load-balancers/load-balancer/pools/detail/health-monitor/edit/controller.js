import { HEALTH_MONITOR_TYPE } from '../constants';

export default class OctaviaLoadBalancerPoolsDetailHealthMonitorEditCtrl {
  /* @ngInject */
  constructor(Alerter, OctaviaLoadBalancerHealthMonitorService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerHealthMonitorService = OctaviaLoadBalancerHealthMonitorService;
    this.$translate = $translate;
  }

  $onInit() {
    this.model = {
      name: this.healthMonitor.name,
      type: this.healthMonitor.monitorType,
      maxRetriesDown: this.healthMonitor.maxRetriesDown,
      delay: this.healthMonitor.delay,
      maxRetries: this.healthMonitor.maxRetries,
      timeout: this.healthMonitor.timeout,
    };

    if (
      this.healthMonitor.httpConfiguration &&
      [HEALTH_MONITOR_TYPE.HTTP, HEALTH_MONITOR_TYPE.HTTPS].includes(
        this.healthMonitor.monitorType,
      )
    ) {
      this.model.urlPath = this.healthMonitor.httpConfiguration.urlPath;
      this.model.expectedCode = this.healthMonitor.httpConfiguration.expectedCodes;
    }
  }

  editHealthMonitor() {
    this.loading = true;
    this.OctaviaLoadBalancerHealthMonitorService.editHealthMonitor(
      this.projectId,
      this.region,
      this.healthMonitor.id,
      this.model,
    )
      .then(() => {
        this.goToDashboard(true).then(() => {
          this.loading = false;
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_health_monitor_edit_success',
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
