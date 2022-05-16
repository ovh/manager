export default class NashaComponentsPartitionSnapshotDeleteController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
  }

  submit() {
    const { customSnapshotName: name, partitionApiUrl } = this;
    const { partitionName } = this.partition;

    this.$http
      .delete(`${partitionApiUrl}/customSnapshot/${name}`)
      .then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_partition_snapshot_delete_success',
            { name, partitionName },
          ),
        }),
      )
      .catch((error) => this.dismiss({ error }));
  }
}
