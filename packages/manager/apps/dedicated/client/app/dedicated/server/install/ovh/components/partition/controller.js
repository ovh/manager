import { DedicatedServerInstallationTemplatePartition } from '@ovh-ux/manager-models';

export default class DedicatedServerInstallOvhPartitionCtrl {
  get partition() {
    return this.model.partition;
  }

  isPartitionInEdition(partition) {
    return (
      this.status.edition && this.partitionInEdition.order === partition.order
    );
  }

  /*= =============================
  =            Events            =
  ============================== */

  onEditPartitionBtnClick(partition) {
    this.status.edition = true;
    this.partitionInEdition = new DedicatedServerInstallationTemplatePartition(
      partition,
    );
  }

  onCancelPartitionEditionBtnClick(partition) {
    this.status.edition = false;
  }

  /*= ====  End of Events  ====== */

  $onInit() {
    this.status = {
      edition: false,
    };

    this.partitionInEdition = null;
  }
}
