import { MAX_PARTITIONS, STATE_NAME } from './partitions.constants';

export default class NashaDashboardPartitionsController {
  /* @ngInject */
  constructor($translate, OvhApiDedicatedNasha) {
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;

    this.isMonitoredUpdating = false;
    this.maxPartitions = MAX_PARTITIONS;
    this.partitionsCount = null;
    this.stateName = STATE_NAME;
  }

  get canCreatePartition() {
    return this.partitionsCount < this.maxPartitions;
  }

  updateMonitored() {
    const { customName, monitored } = this.nasha;
    const { serviceName } = this;

    this.isMonitoredUpdating = true;

    this.OvhApiDedicatedNasha.v6()
      .updateDetail({ monitored, customName, serviceName })
      .$promise.then(() =>
        this.alertSuccess(
          this.$translate.instant(
            `nasha_dashboard_partitions_monitored_${monitored ? 'on' : 'off'}`,
          ),
        ),
      )
      .catch((error) => this.alertError(error))
      .finally(() => {
        this.isMonitoredUpdating = false;
      });
  }

  loadPartitions() {
    const { serviceName } = this;
    const aapi = this.OvhApiDedicatedNasha.Aapi();

    aapi.resetCache();

    return aapi
      .partitions({ serviceName })
      .$promise.then((partitions) => partitions.map(this.preparePartition))
      .then((partitions) => {
        const totalCount = partitions.length;
        this.partitionsCount = totalCount;
        return {
          data: partitions,
          meta: { totalCount },
        };
      })
      .catch((error) => this.alertError({ error }));
  }
}
