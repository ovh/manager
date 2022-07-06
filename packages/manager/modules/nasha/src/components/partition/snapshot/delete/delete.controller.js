export default class NashaComponentsPartitionSnapshotDeleteController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
  }

  submit() {
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;
    const { customSnapshotName } = this;

    this.$http
      .delete(
        `/dedicated/nasha/${serviceName}/partition/${partitionName}/customSnapshot/${customSnapshotName}`,
      )
      .then(({ data: { taskId } }) =>
        this.close({
          taskIds: [taskId],
          params: { partitionName, customSnapshotName },
        }),
      )
      .catch((error) => this.dismiss({ error }));
  }
}
