import { ANALYTICS_DATA_PLATFORM_GUIDE_LINKS } from '../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor(analyticsDataPlatformService, CucCloudMessage) {
    this.cucCloudMessage = CucCloudMessage;
    this.analyticsDataPlatformService = analyticsDataPlatformService;
  }

  $onInit() {
    this.guideLinks = ANALYTICS_DATA_PLATFORM_GUIDE_LINKS;
    this.subscribeToMessages();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  subscribeToMessages() {
    this.cucCloudMessage.unSubscribe(
      'pci.projects.project.analytics-data-platform.details',
    );
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.analytics-data-platform.details',
      { onMessage: () => this.refreshMessage() },
    );
  }
}
