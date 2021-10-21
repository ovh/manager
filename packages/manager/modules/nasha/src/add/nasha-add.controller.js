export default class NashaAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $state,
    $window,
    CucCloudMessage,
    CucControllerHelper,
    NashaAddService,
  ) {
    this.$translate = $translate;
    this.$state = $state;
    this.$window = $window;
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
      selectedDuration: 1,
      order: null,
    };

    this.loadMessages();
    this.datacenters = [];
    this.offers.load();
    this.catalog.load();
  }

  order() {
    this.NashaAddService.order(this.data).then(({ url }) =>
      this.$window.open(url, '_blank'),
    );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  isLoadingOfferData() {
    return this.offers.loading;
  }

  initLoaders() {
    this.offers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.NashaAddService.getOffers().then((offers) => {
          this.allOffers = offers;
          return offers;
        }),
    });

    this.catalog = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.NashaAddService.getCatalog(),
    });
  }

  loadMessages() {
    const stateName = 'nasha-add';
    this.CucCloudMessage.unSubscribe(stateName);
    this.messageHandler = this.CucCloudMessage.subscribe(stateName, {
      onMessage: () => this.refreshMessage(),
    });
    this.CucCloudMessage.info(
      this.$translate.instant('nasha_order_datacenter_unavailable', {
        region: this.$translate.instant('nasha_order_datacenter_gra'),
        fallback: this.$translate.instant('nasha_order_datacenter_rbx'),
      }),
    );
  }

  onOfferChanged() {
    const plan = this.catalog.data.plans.find(
      ({ planCode }) => planCode === this.data.selectedModel,
    );
    this.datacenters =
      plan.configurations.find(({ name }) => name === 'datacenter').values ||
      [];
  }
}
