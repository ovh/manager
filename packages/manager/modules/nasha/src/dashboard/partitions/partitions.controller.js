import { MAX_PARTITIONS, STATE_NAME } from './partitions.constants';

export default class NashaDashboardPartitionsController {
  /* @ngInject */
  constructor($translate, OvhApiDedicatedNasha, NashaTask) {
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.NashaTask = NashaTask;

    this.isMonitoredUpdating = false;
    this.maxPartitions = MAX_PARTITIONS;
    this.partitionsCount = null;
    this.stateName = STATE_NAME;
    this.operations = [
      this.NashaTask.operation.Create,
      this.NashaTask.operation.Delete,
      this.NashaTask.operation.Update,
      this.NashaTask.operation.ZfsOptions,
    ];
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
      .then((partitions) => this.mergeTasks(partitions))
      .then((partitions) => this.formatDataGrid(partitions))
      .catch((error) => this.alertError({ error }));
  }

  mergeTasks(partitions) {
    this.tasks
      .filter(({ operation }) => operation === this.NashaTask.operation.Create)
      .forEach(({ partitionName }) => {
        partitions.push({ partitionName, inCreation: true });
      });

    return partitions
      .map((item) => ({
        ...item,
        tasks: this.tasks.filter(
          ({ operation, partitionName }) =>
            this.operations.includes(operation) &&
            partitionName === item.partitionName,
        ),
      }))
      .map((item) => ({
        ...item,
        inDeletion: this.hasOperation(item, 'Delete'),
      }));
  }

  formatDataGrid(partitions) {
    const totalCount = partitions.length;
    this.partitionsCount = totalCount;
    return {
      data: partitions,
      meta: { totalCount },
    };
  }

  hasOperation(partition, operation) {
    const tasks = partition.tasks.filter(
      (task) => task.operation === this.NashaTask.operation[operation],
    );
    return tasks.length > 0;
  }
}
