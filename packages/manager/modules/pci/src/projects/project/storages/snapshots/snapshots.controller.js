import { getCriteria } from '../../project.utils';

export default class PciStorageSnapshotsController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    CucRegionService,
    PciProjectStorageSnapshotsService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectStorageSnapshotsService = PciProjectStorageSnapshotsService;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.snapshotId);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.snapshots',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
