import get from 'lodash/get';
import { NAME_PATTERN_REGEX, NEW_PARTITION_SIZE } from './add.constants';

export default class NashaPartitionAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    OvhApiDedicatedNasha,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;

    this.nasha = null;
    this.protocols = [];
    this.protocols = null;
    this.loading = false;

    this.newPartition = {
      partitionName: null,
      size: NEW_PARTITION_SIZE,
      protocol: null,
    };

    this.error = {
      name: false,
    };

    this.namePattern = NAME_PATTERN_REGEX;
  }

  $onInit() {
    this.loading = true;
    this.$q.all({
      nasha: this.OvhApiDedicatedNasha.v6().get({ serviceName: this.serviceName }).$promise,
      schema: this.OvhApiDedicatedNasha.v6().schema().$promise,
    }).then((data) => {
      this.protocols = data.schema.models['dedicated.storage.ProtocolEnum'].enum;
      this.nasha = data.nasha;
    }).finally(() => {
      this.loading = false;
    });
  }

  isPartitionValid() {
    return this.newPartition.partitionName // Partition name is set
      && this.newPartition.size // partition size is set
      && this.newPartition.protocol // protocol is set
      && this.newPartition.size >= 10 // partition size is minimum 10 GB
      // partition size is less or equal than the maax returned by the pi
      && this.newPartition.size <= this.nasha.zpoolSize;
  }

  addPartition() {
    this.loading = true;
    this.OvhApiDedicatedNasha.Partition().v6().create({
      serviceName: this.nasha.serviceName,
    }, {
      partitionName: this.newPartition.partitionName,
      protocol: this.newPartition.protocol,
      size: this.newPartition.size,
    }).$promise.then((result) => {
      this.goToPartitionPage(
        this.$translate.instant('nasha_partitions_action_add_success', {
          partitionName: this.newPartition.name,
        }),
        'success',
        {
          partition: this.newPartition,
          tasks: [result.data.taskId],
          isNew: true,
        },
      );
    })
      .catch((error) => this.goToPartitionPage(
        this.$translate.instant('nasha_partitions_action_add_failure', {
          partitionName: this.newPartition.name,
          message: get(error, 'data.message'),
        }),
        'error',
      )).finally(() => {
        this.loading = false;
      });
  }

  dismiss() {
    this.goToPartitionPage();
  }
}
