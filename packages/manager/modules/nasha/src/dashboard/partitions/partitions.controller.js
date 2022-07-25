import { MAX_PARTITIONS } from '../dashboard.constants';

export default class NashaDashboardPartitionsController {
  /* @ngInject */
  constructor($translate, $http, OvhApiDedicatedNashaAapi) {
    this.$translate = $translate;
    this.$http = $http;
    this.OvhApiDedicatedNashaAapi = OvhApiDedicatedNashaAapi;

    this.isMonitoredUpdating = false;
    this.maxPartitions = MAX_PARTITIONS;
  }

  updateMonitored() {
    const { monitored } = this.nasha;

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

  loadPartitions() {
    const { serviceName } = this;

    this.OvhApiDedicatedNashaAapi.resetCache();

    return this.OvhApiDedicatedNashaAapi.partitions({ serviceName })
      .$promise.then((partitions) => partitions.map(this.preparePartition))
      .then((partitions) => {
        const totalCount = partitions.length;
        return {
          data: partitions,
          meta: { totalCount },
        };
      })
      .catch((error) => this.alertError({ error }));
  }
}
