import { SIZE_MIN } from '../partition.constants';

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
    this.sizeMax = this.nasha.zpoolSize;
  }

  submit() {
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
}
