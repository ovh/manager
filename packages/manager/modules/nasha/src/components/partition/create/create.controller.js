import {
  DESCRIPTION_MAX,
  NAME_PATTERN,
  SIZE_MIN,
} from '../partition.constants';

export default class NashaComponentsPartitionCreateController {
  /* @ngInject */
  constructor($translate, OvhApiDedicatedNasha) {
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;

    this.isLoading = true;

    this.protocols = [];
    this.model = {
      partitionName: null,
      size: null,
      protocol: null,
    };
  }

  $onInit() {
    this.namePattern = NAME_PATTERN;
    this.descriptionMax = DESCRIPTION_MAX;
    this.sizeMin = SIZE_MIN;
    this.sizeMax = this.nasha.zpoolSize;

    this.OvhApiDedicatedNasha.v6()
      .schema()
      .$promise.then((data) => {
        this.protocols = data.models['dedicated.storage.ProtocolEnum'].enum.map(
          (protocol) => ({
            value: protocol,
            name: protocol.replace(/_/g, ' '),
          }),
        );
      })
      .catch((error) => this.close({ error }))
      .finally(() => {
        this.isLoading = false;
      });
  }

  submit() {
    const { serviceName } = this.nasha;
    const partition = this.model;

    this.OvhApiDedicatedNasha.Partition()
      .v6()
      .create({ serviceName }, partition)
      .$promise.then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_partition_create_success',
            partition,
          ),
        }),
      )
      .catch((error) => this.close({ error }));
  }
}
