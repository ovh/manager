export default class NashaComponentsPartitionDeleteController {
  /* @ngInject */
  constructor($translate, OvhApiDedicatedNasha) {
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
  }

  submit() {
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;

    return this.OvhApiDedicatedNasha.Partition()
      .v6()
      .delete({ serviceName, partitionName })
      .$promise.then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_partition_delete_success',
            { partitionName },
          ),
        }),
      )
      .catch((error) => this.close({ error }));
  }
}
