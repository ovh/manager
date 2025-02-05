import { getCriteria } from '../../project.utils';

export default class PciStorageSnapshotsController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    PciProjectStorageSnapshotsService,
    CHANGELOG,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectStorageSnapshotsService = PciProjectStorageSnapshotsService;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.snapshotId);

    if (this.taskResponse) {
      const { type, message } = this.taskResponse.cucCloudParams;
      this.taskResponse = null;
      this.CucCloudMessage[type](message);
    }
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
