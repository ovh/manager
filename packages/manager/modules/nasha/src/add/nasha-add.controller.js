export default class NashaAddCtrl {
  /* @ngInject */
  constructor($translate, $state, CucCloudMessage, CucControllerHelper, NashaAddService) {
    this.$translate = $translate;
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.NashaAddService = NashaAddService;

    this.data = {};
    this.messages = {};

    this.initLoaders();
  }

  $onInit() {
    this.data = {
      selectedDatacenter: null,
      selectedModel: null,
      selectedDuration: null,
      order: null,
    };

    this.loadMessages();
    this.datacenters.load();
    this.offers.load();
    this.durations.load();
  }

  order() {
    this.NashaAddService.order(this.data)
      .then((response) => this.$state.go('nasha-order-complete', { orderUrl: response.url }));
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  isLoadingOfferData() {
    return this.datacenters.loading || this.offers.loading || this.durations.loading;
  }

  initLoaders() {
    this.datacenters = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.NashaAddService.getAvailableRegions(),
    });

    this.offers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.NashaAddService.getOffers(),
    });

    this.durations = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.NashaAddService.getDurations(),
    });
  }

  loadMessages() {
    const stateName = 'nasha-add';
    this.CucCloudMessage.unSubscribe(stateName);
    this.messageHandler = this.CucCloudMessage.subscribe(stateName, {
      onMessage: () => this.refreshMessage(),
    });
    this.CucCloudMessage.info(this.$translate.instant('nasha_order_datacenter_unavailable', { region: this.$translate.instant('nasha_order_datacenter_gra'), fallback: this.$translate.instant('nasha_order_datacenter_rbx') }));
  }
}
