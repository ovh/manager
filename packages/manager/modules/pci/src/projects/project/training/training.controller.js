import { GUIDE_URL, COMMUNITY_URL } from './training.constants';

export default class PciTrainingController {
  /* @ngInject */
  constructor(CucCloudMessage, ovhManagerRegionService) {
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.loadMessages();
    this.guideUrl = GUIDE_URL;
    this.communityUrl = COMMUNITY_URL;
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
