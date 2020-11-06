import find from 'lodash/find';
import { UnitAndValueSize } from '@ovh-ux/manager-models';

import DedicatedServerInstallOvhRaidModel from './raid.model.class';

export default class DedicatedServerInstallOvhModel {
  constructor() {
    this.template = {};
    this.partition = {};
    this.raid = new DedicatedServerInstallOvhRaidModel();

    this.totalSize = {
      size: null,
      readable: null,
    };
    this.remainingSize = {
      size: null,
      readable: null,
    };
  }

  refreshTotalSize() {
    if (this.template.raidController !== null) {
      this.totalSize.size = new UnitAndValueSize(
        this.template.diskGroup.diskSize,
      );
    } else {
      this.totalSize.size = new UnitAndValueSize({
        value:
          this.template.diskGroup.diskSize.value *
          this.template.diskGroup.numberOfDisks,
        unit: this.template.diskGroup.diskSize.unit,
      });
    }
    this.totalSize.readable = this.totalSize.size.convertToReadable();
  }

  getRemainingSize() {
    const partitionSize = this.partition.template.defaultPartitionScheme.getPartitionSize();
    const totalSize = this.totalSize.size.convertTo(partitionSize.unit);

    return new UnitAndValueSize({
      value: totalSize.value - partitionSize.value,
      unit: partitionSize.unit,
    });
  }

  refreshRemainingSize() {
    const partitionSize = this.partition.template.defaultPartitionScheme.getPartitionSize();
    const totalSize = this.totalSize.size.convertTo(partitionSize.unit);
    this.remainingSize.size = this.getRemainingSize();
    this.remainingSize.readable = this.remainingSize.size.convertToReadable();
  }

  setRemainingSizeToEmptyPartition() {
    const emptyPartition = find(
      this.partition.template.defaultPartitionScheme.partitions,
      ({ size }) => size.value === 0,
    );

    if (emptyPartition) {
      emptyPartition.size = this.getRemainingSize();
    }
  }

  setPartitionTemplate(installationTemplate) {
    this.partition.template = installationTemplate;
    this.refreshTotalSize();
  }
}
