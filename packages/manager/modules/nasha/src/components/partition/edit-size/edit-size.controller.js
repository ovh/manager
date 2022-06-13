import { SIZE_MIN } from '../partition.constants';

export default class NashaComponentsPartitionEditSizeController {
  /* @ngInject */
  constructor($translate, OvhApiDedicatedNasha, iceberg, NashaTask) {
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.iceberg = iceberg;
    this.NashaTask = NashaTask;

    this.model = { size: null };
    this.sizeMin = SIZE_MIN;
    this.sizeMax = 0;
  }

  $onInit() {
    this.model.size = this.partition.size;
    this.sizeMax = this.nasha.zpoolSize;
  }

  submit() {
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;
    const { size } = this.model;

    this.OvhApiDedicatedNasha.Partition()
      .v6()
      .update({ serviceName }, { partitionName, size })
      .$promise.then(() =>
        this.iceberg(`${this.nashaApiUrl}/task`)
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('storageName', 'eq', serviceName)
          .addFilter('partitionName', 'eq', partitionName)
          .addFilter('operation', 'eq', this.NashaTask.operation.Update)
          .addFilter('status', 'eq', this.NashaTask.status.Todo)
          .limit(1)
          .execute(null, true)
          .$promise.then(({ data: [task] }) => task),
      )
      .then((task) => this.close({ task }))
      .catch((error) => this.close({ error }));
  }
}
