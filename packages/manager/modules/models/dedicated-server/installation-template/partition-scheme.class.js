import { DedicatedServerInstallationTemplatePartition } from './partition.class';

export class DedicatedServerInstallationTemplatePartitionScheme {
  constructor(options) {
    Object.assign(this, {
      ...options,
      partitions: [],
    });
  }

  addPartition(partition) {
    let templatePartition = partition;

    if (
      !(
        templatePartition instanceof
        DedicatedServerInstallationTemplatePartition
      )
    ) {
      templatePartition = new DedicatedServerInstallationTemplatePartition(
        templatePartition,
      );
    }

    this.partitions.push(templatePartition);

    return templatePartition;
  }

  addPartitions(partitions = []) {
    partitions.forEach((partition) => this.addPartition(partition));

    return this.partitions;
  }

  getPartitionSize() {
    const totalSpace = this.partitions.reduce(
      (total, partition) => total + partition.size.value,
      0,
    );

    return {
      value: totalSpace,
      unit: this.partitions[0].size.unit,
    };
  }
}

export default {
  DedicatedServerInstallationTemplatePartitionScheme,
};
