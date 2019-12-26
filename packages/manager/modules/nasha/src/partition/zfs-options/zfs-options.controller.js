import get from 'lodash/get';

export default class NashaPartitionZFSOptionsCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiDedicatedNasha,
    NashaPartitionZFSOptionsService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.NashaPartitionZFSOptionsService = NashaPartitionZFSOptionsService;

    this.enums = {};
    this.states = {
      saving: false,
    };
    this.model = {};
  }

  $onInit() {
    this.loaders = true;
    this.data = {
      partition: this.partition,
    };
    this.data.partition = this.partition;
    this.NashaPartitionZFSOptionsService.getZFSOptionsEnums()
      .then((enums) => {
        this.enums = enums;
        return this.NashaPartitionZFSOptionsService.getCurrentZFSOptions(
          this.serviceName,
          this.data.partition.partitionName,
        );
      })
      .then((options) => {
        this.model = options;
      })
      .catch(() => {
        this.dismiss();
        this.CucCloudMessage.error(
          this.$translate.instant('nasha_partitions_zfs_modal_loading_fail'),
        );
      })
      .finally(() => {
        this.loaders = false;
      });
  }

  applyZFSOptionsChanges() {
    this.states.saving = true;
    this.OvhApiDedicatedNasha.Partition()
      .Options()
      .v6()
      .save(
        {
          serviceName: this.serviceName,
          partitionName: this.data.partition.partitionName,
        },
        {
          atime: this.model.atime ? 'on' : 'off',
          recordsize: this.model.recordsize,
          sync: this.model.sync,
        },
      )
      .$promise.then((result) => {
        this.goToPartitionPage(
          this.$translate.instant('nasha_partitions_zfs_modal_success', {
            partition: this.data.partition,
          }),
          'success',
          {
            tasks: [result.data.taskId],
          },
        );
      })
      .catch((error) =>
        this.goToPartitionPage(
          this.$translate.instant('nasha_partitions_zfs_modal_fail', {
            partitionName: this.data.partition.partitionName,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.states.saving = false;
      });
  }

  dismiss() {
    this.goToPartitionPage();
  }
}
