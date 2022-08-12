import {
  SIZE_MIN,
  PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE,
} from '../partition.constants';

export default class NashaComponentsPartitionEditSizeController {
  /* @ngInject */
  constructor($http, TaskTrackerService) {
    this.$http = $http;
    this.TaskTrackerService = TaskTrackerService;

    this.model = { size: null };
    this.sizeMin = SIZE_MIN;
    this.sizeMax = 0;
  }

  $onInit() {
    this.model.size = this.partition.size;
    this.sizeMax =
      this.nasha.zpoolSize - this.partitionAllocatedSize + this.partition.size;
  }

  submit() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE, 'confirm');

    const { partitionName } = this.partition;

    return this.$http
      .put(this.partitionApiUrl, this.model)
      .then(() =>
        this.TaskTrackerService.getTasksBy(this.taskApiUrl, {
          operation: 'clusterLeclercPartitionUpdate',
          status: 'todo',
          partitionName,
        }),
      )
      .then((tasks) => this.close({ tasks, partitionName }))
      .catch((error) => this.close({ error }));
  }

  onCancelClick() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE, 'cancel');
    return this.close();
  }
}
