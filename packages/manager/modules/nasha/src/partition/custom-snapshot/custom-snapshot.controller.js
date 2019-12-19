import get from 'lodash/get';

export default class NashaPartitionCustomSnapshotAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiDedicatedNashaPartition,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedNashaPartition = OvhApiDedicatedNashaPartition;
    this.saving = false;
    this.options = {
      snapshotName: {
        maxLength: 70,
      },
    };
    this.snapshotName = '';
  }

  $onInit() {
    this.data = {
      partition: this.partition,
      customSnapshot: {
        prefix: 'snap-',
      },
    };

    this.computeDefaultSnapshotName();
  }

  computeDefaultSnapshotName() {
    const currentDate = new Date();
    const timeZonedDate = new Date(currentDate.getTime()
      - (currentDate.getTimezoneOffset() * 60000));
    const dateString = timeZonedDate.toISOString();
    this.snapshotName = `${this.data.partition.partitionName}-${dateString}`;
  }

  addCustomSnapshot() {
    this.saving = true;
    this.OvhApiDedicatedNashaPartition.CustomSnapshot().v6().add({
      serviceName: this.serviceName,
      partitionName: this.data.partition.partitionName,
    }, {
      name: this.snapshotName,
    }).$promise.then((result) => {
      this.goToPartitionPage(
        this.$translate.instant('nasha_custom_snapshot_modal_success', {
          partition: this.data.partition,
        }),
        'success',
        {
          tasks: [result.data.taskId],
        },
      );
    })
      .catch((error) => this.goToPartitionPage(
        this.$translate.instant('nasha_custom_snapshot_modal_fail', {
          partitionName: this.data.partition.partitionName,
          message: get(error, 'data.message'),
        }),
        'error',
      ))
      .finally(() => {
        this.saving = false;
      });
  }

  dismiss() {
    this.goToPartitionPage();
  }
}
