import { getCriteria } from '../../project.utils';

export default class PciInstanceBackupsController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.backupId);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.instance-backups',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
