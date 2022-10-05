import { AI_PRICES_URL, GUIDES } from './ai-dashboard.constants';

export default class AIDashboardCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, coreConfig, atInternet) {
    this.CucCloudMessage = CucCloudMessage;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
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
    this.CucCloudMessage.unSubscribe('pci.projects.project.ai-dashboard');
    this.messageHandler = this.CucCloudMessage.subscribe(
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
