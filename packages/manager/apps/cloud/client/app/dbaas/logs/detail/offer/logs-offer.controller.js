class LogsOfferCtrl {
  constructor(
    $state,
    $stateParams,
    $window,
    CucControllerHelper,
    LogsConstants,
    LogsOfferService,
    LogsOrderService,
    CucOrderHelperService,
    LogsDetailService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsOfferService = LogsOfferService;
    this.LogsOrderService = LogsOrderService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucOrderHelperService = CucOrderHelperService;
    this.LogsDetailService = LogsDetailService;
    this.LogsConstants = LogsConstants;
    this.$window = $window;
    this.offerDetail = {
      quantity: 1,
      selectedOffer: '',
      currentOffer: '',
      currentOfferType: 'basic',
    };
    this.initLoaders();
  }

  initLoaders() {
    this.getSelectedPlan = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOfferService.getOffer(this.serviceName).then((selectedPlan) =>
          this.selectOffer(selectedPlan),
        ),
    });

    this.offers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsOrderService.getOrder(this.serviceName),
    });

    this.service = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDetailService.getServiceDetails(this.serviceName).then(
          (service) => {
            if (service.state !== this.LogsConstants.SERVICE_STATE_ENABLED) {
              this.goToHomePage();
            } else {
              this.getSelectedPlan.load();
              this.offers.load();
            }
            return service;
          },
        ),
    });
    this.service.load();
  }

  selectOffer(offerObj) {
    this.offerDetail.selectedOffer = offerObj.reference;
    this.offerDetail.currentOffer = offerObj.reference;
    if (offerObj.reference !== this.LogsConstants.basicOffer) {
      this.offerDetail.currentOfferType = 'pro';
    }
  }

  processOrder() {
    this.savingOffer = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOrderService.saveOrder(this.serviceName, this.offerDetail)
          .then((response) => this.$window.open(response.order.url, '_target'))
          .catch(() => this.CucControllerHelper.scrollPageToTop())
          .finally(() => this.goToHomePage()),
    });
    this.savingOffer.load();
  }

  saveOffer() {
    if (this.offerDetail.selectedOffer === this.offerDetail.currentOffer) {
      this.LogsOfferService.showWarning();
    } else {
      this.processOrder();
    }
  }

  orderPro() {
    this.offerDetail.currentOfferType = 'upgrade';
  }

  goToHomePage() {
    this.$state.go('dbaas.logs.detail.home');
  }
}

angular.module('managerApp').controller('LogsOfferCtrl', LogsOfferCtrl);
