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
      selectedDuration: null,
      order: null,
    };

    this.loadMessages();
    this.datacenters.load();
    this.offers.load();
    this.durations.load();
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
    return (
      this.datacenters.loading || this.offers.loading || this.durations.loading
    );
  }

  initLoaders() {
    this.datacenters = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.NashaAddService.getAvailableRegions(),
    });

    this.offers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.NashaAddService.getOffers().then((offers) => {
          this.allOffers = offers;
          return offers;
        }),
    });

    this.durations = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.NashaAddService.getDurations(),
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

  onDatacenterChanged() {
    const plans = this.catalog.data.plans
      .filter((plan) =>
        plan.configurations[0].values.includes(
          this.data.selectedDatacenter.toUpperCase(),
        ),
      )
      .map(({ planCode }) => planCode);

    this.offers.data = this.allOffers.filter((offer) =>
      plans.includes(offer.planCode),
    );
  }
}
