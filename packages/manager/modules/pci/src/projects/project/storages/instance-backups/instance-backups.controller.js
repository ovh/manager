import { getCriteria } from '../../project.utils';

export default class PciInstanceBackupsController {
  /* @ngInject */
  constructor($state, CucCloudMessage, ovhManagerRegionService) {
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
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

  refreshList() {
    const { name } = this.$state.current;
    return this.$state.go(name, {}, { reload: name });
  }
}
