export default class NashaComponentsPartitionDeleteController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  submit() {
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
}
