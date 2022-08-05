import { PREFIX_TRACKING_PARTITION_ACL } from '../../partition.constants';

export default class NashaComponentsPartitionAccessDeleteController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  submit() {
    this.trackClick(PREFIX_TRACKING_PARTITION_ACL, 'confirm-delete-access');

    return this.$http
      .delete(`${this.partitionApiUrl}/access/${encodeURIComponent(this.ip)}`)
      .then(({ data: task }) =>
        this.close({
          tasks: [task],
          partitionName: this.partition.partitionName,
          ip: this.ip,
        }),
      )
      .catch((error) => this.close({ error }));
  }

  onCancelClick() {
    this.trackClick(PREFIX_TRACKING_PARTITION_ACL, 'cancel-delete-access');
    return this.close();
  }
}
