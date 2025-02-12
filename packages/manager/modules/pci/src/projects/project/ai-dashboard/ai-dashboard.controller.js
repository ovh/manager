import { AI_PRICES_URL, GUIDES } from './ai-dashboard.constants';

export default class AiDashboardCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, coreConfig, atInternet, CHANGELOG) {
    this.cucCloudMessage = CucCloudMessage;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.loadMessages();
    this.aiPricesUrl =
      AI_PRICES_URL[this.coreConfig.getUser().ovhSubsidiary] ||
      AI_PRICES_URL.DEFAULT;

    this.guides = GUIDES.map((guide) => {
      return {
        id: guide.id,
        link:
          guide.link[this.coreConfig.getUser().ovhSubsidiary] ||
          guide.link.DEFAULT,
      };
    });
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe('pci.projects.project.ai-dashboard');
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.ai-dashboard',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  trackClick(guide) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::guide::${guide.id}`,
      type: 'action',
    });
  }
}
