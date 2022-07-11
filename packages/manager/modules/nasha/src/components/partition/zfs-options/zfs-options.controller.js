import isEqual from 'lodash/isEqual';

export default class NashaComponentsPartitionZfsOptionsController {
  /* @ngInject */
  constructor($q, $translate, ZfsOptionsService) {
    this.$q = $q;
    this.$translate = $translate;
    this.ZfsOptionsService = ZfsOptionsService;

    this.isLoading = false;
    this.recordsizeOptions = [];
    this.syncOptions = [];
    this.baseModel = null;
    this.model = {
      atime: null,
      recordsize: null,
      sync: null,
    };
  }

  $onInit() {
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;

    this.isLoading = true;

    return this.$q
      .all({
        enums: this.ZfsOptionsService.getEnums(),
        options: this.ZfsOptionsService.getOptions(serviceName, partitionName),
      })
      .then(({ enums, options }) => {
        this.recordsizeOptions = enums.recordsize;
        this.syncOptions = enums.sync;
        this.model = options;
        this.baseModel = { ...options };
      })
      .catch((error) => this.close({ error }))
      .finally(() => {
        this.isLoading = false;
      });
  }

  get canSubmit() {
    return !isEqual(this.model, this.baseModel);
  }

  submit() {
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;

    return this.ZfsOptionsService.setOptions(
      serviceName,
      partitionName,
      this.model,
    )
      .then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_partition_zfs_options_success',
            { partitionName },
          ),
        }),
      )
      .catch((error) => this.close({ error }));
  }

  getRecordSizeLabel(recordsize) {
    const stringBuilder = [recordsize.label];

    if (recordsize.default) {
      stringBuilder.push(
        this.$translate.instant(
          'nasha_components_partition_zfs_options_default',
        ),
      );
    }

    return stringBuilder.join(' ');
  }
}
