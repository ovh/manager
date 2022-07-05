import NashaDashboardController from '../dashboard.controller';

export default class NashaDashboardPartitionController extends NashaDashboardController {
  get name() {
    return this.partition.partitionName;
  }

  $onInit() {
    this.partitionNames = this.partitions.map(
      ({ partitionName }) => partitionName,
    );
  }
}
