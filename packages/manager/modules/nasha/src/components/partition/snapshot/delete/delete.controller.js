import { PREFIX_TRACKING_SNAPSHOT_POLICY } from '../../partition.constants';

export default class NashaComponentsPartitionSnapshotDeleteController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  submit() {
    this.trackClick(PREFIX_TRACKING_SNAPSHOT_POLICY, 'confirm-delete-snapshot');

    const { customSnapshotName } = this;

    return this.$http
      .delete(`${this.partitionApiUrl}/customSnapshot/${customSnapshotName}`)
      .then(({ data: task }) =>
        this.close({
          tasks: [task],
          partitionName: this.partition.partitionName,
          customSnapshotName,
          trackingData: {
            prefix: PREFIX_TRACKING_SNAPSHOT_POLICY,
            hit: 'close-delete-snapshot',
          },
        }),
      )
      .catch((error) => this.close({ error }));
  }

  onCancelClick() {
    this.trackClick(PREFIX_TRACKING_SNAPSHOT_POLICY, 'cancel-delete-snapshot');
    return this.close();
  }
}
