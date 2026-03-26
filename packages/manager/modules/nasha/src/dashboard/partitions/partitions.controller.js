import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '../dashboard.constants';

export default class NashaDashboardPartitionsController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;

    this.isMonitoredUpdating = false;
  }

  updateMonitored() {
    const { monitored } = this.nasha;

    this.trackClick(
      PREFIX_TRACKING_DASHBOARD_PARTITIONS,
      `usage-notification::${monitored ? 'enable' : 'disable'}`,
    );

    this.isMonitoredUpdating = true;

    this.$http
      .put(`${this.nashaApiUrl}`, { monitored })
      .then(() =>
        this.alertSuccess(
          this.$translate.instant(
            `nasha_dashboard_partitions_monitored_${monitored ? 'on' : 'off'}`,
          ),
        ),
      )
      .catch((error) => {
        this.alertError(error);
        this.nasha.monitored = !monitored;
      })
      .finally(() => {
        this.isMonitoredUpdating = false;
      });
  }

  onRenewClick() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'renew');
  }

  onPartitionsCreateClick() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'create-partition');
    return this.goToTabPartitionsCreate();
  }
}
