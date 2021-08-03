import { getCriteria } from '../project.utils';

export default class PciServingController {
  /* @ngInject */
  constructor(CucCloudMessage, ovhManagerRegionService, atInternet) {
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.namespaceId);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.serving',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
