export default class NashaComponentsPartitionSnapshotDeleteController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
  }

  submit() {
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;
    const { customSnapshotName: name } = this;

    this.$http
      .delete(
        `/dedicated/nasha/${serviceName}/partition/${partitionName}/customSnapshot/${name}`,
      )
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
