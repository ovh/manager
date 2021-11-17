import { GUIDE_URL, COMMUNITY_URL } from './ai.constants';

export default class PciAiController {
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
      'pci.projects.project.ai',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
