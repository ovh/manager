export default class NashaComponentsPartitionAccessDeleteController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  submit() {
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
}
