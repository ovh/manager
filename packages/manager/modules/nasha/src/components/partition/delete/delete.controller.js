import { PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE } from '../partition.constants';

export default class NashaComponentsPartitionDeleteController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  submit() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE, 'confirm');
    return this.$http
      .delete(this.partitionApiUrl)
      .then(({ data: task }) =>
        this.close({
          tasks: [task],
          partitionName: this.partition.partitionName,
        }),
      )
      .catch((error) => this.close({ error }));
  }

  onCancelClick() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE, 'cancel');
    return this.close();
  }
}
