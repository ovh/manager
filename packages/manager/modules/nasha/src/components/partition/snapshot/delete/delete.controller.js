export default class NashaComponentsPartitionSnapshotDeleteController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  submit() {
    const { customSnapshotName } = this;

    return this.$http
      .delete(`${this.partitionApiUrl}/customSnapshot/${customSnapshotName}`)
      .then(({ data: task }) =>
        this.close({
          tasks: [task],
          partitionName: this.partition.partitionName,
          customSnapshotName,
        }),
      )
      .catch((error) => this.close({ error }));
  }
}
