export default class {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    CucRegionService,
    OtrsPopupService,
    PCI_REDIRECT_URLS,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.OtrsPopupService = OtrsPopupService;
    this.PCI_REDIRECT_URLS = PCI_REDIRECT_URLS;
  }

  $onInit() {
    this.loadMessages();

    this.paymentmeanUrl = this.PCI_REDIRECT_URLS[this.region].paymentMeans;
    this.supportUrl = this.PCI_REDIRECT_URLS[this.region].support;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.quota');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.quota',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  openSupport() {
    if (!this.OtrsPopupService.isLoaded()) {
      this.OtrsPopupService.init();
    } else {
      this.OtrsPopupService.toggle();
    }
  }
}
