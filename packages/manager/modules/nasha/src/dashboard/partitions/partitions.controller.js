import { MAX_PARTITIONS, STATE_NAME } from './partitions.constants';

export default class NashaDashboardPartitionsController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiDedicatedNasha,
    NashaTask,
    Poller,
    iceberg,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.NashaTask = NashaTask;
    this.Poller = Poller;
    this.iceberg = iceberg;

    this.isMonitoredUpdating = false;
    this.maxPartitions = MAX_PARTITIONS;
    this.partitionsCount = null;
  }

  get canCreatePartition() {
    return this.partitionsCount < this.maxPartitions;
  }

  $onDestroy() {
    this.Poller.kill({ namespace: STATE_NAME });
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

    return this.$q
      .all({
        partitions: aapi.partitions({ serviceName }).$promise,
        tasks: this.iceberg(`/dedicated/nasha/${serviceName}/task`)
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('status', 'in', Object.values(this.NashaTask.status))
          .execute(null, true)
          .$promise.then(({ data }) => data),
      })
      .then(({ partitions, tasks }) => this.mergeTasks(partitions, tasks))
      .then((partitions) => this.startPolls(partitions))
      .then((partitions) => this.formatDataGrid(partitions))
      .catch((error) => this.alertError({ error }));
  }

  mergeTasks(partitions, tasks) {
    const operations = Object.values(this.NashaTask.operation);
    tasks
      .filter(({ operation }) => operation === this.NashaTask.operation.Add)
      .forEach(({ partitionName }) => {
        partitions.push({ partitionName, inCreation: true });
      });
    return partitions.map(this.preparePartition).map((item) => ({
      ...item,
      tasks: tasks
        .filter(({ partitionName }) => partitionName === item.partitionName)
        .filter(({ operation }) => operations.includes(operation)),
    }));
  }

  startPolls(partitions) {
    const { serviceName } = this;
    const statuses = Object.values(this.NashaTask.status);
    return partitions.map((partition) => ({
      ...partition,
      polls: partition.tasks.map((task) =>
        this.Poller.poll(
          `/dedicated/nasha/${serviceName}/task/${task.taskId}`,
          null,
          {
            namespace: STATE_NAME,
            successRule: ({ status }) => !statuses.includes(status),
          },
        ).then(this.reload),
      ),
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
}
