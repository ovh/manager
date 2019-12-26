import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import set from 'lodash/set';

class LogsOptionsCtrl {
  constructor(
    $state,
    $stateParams,
    $window,
    CucControllerHelper,
    LogsConstants,
    LogsOfferService,
    LogsOptionsService,
    CucCurrencyService,
    CucOrderHelperService,
    LogsDetailService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsOptionsService = LogsOptionsService;
    this.CucCurrencyService = CucCurrencyService;
    this.CucOrderHelperService = CucOrderHelperService;
    this.LogsDetailService = LogsDetailService;
    this.LogsConstants = LogsConstants;

    this.serviceName = this.$stateParams.serviceName;
    this.messages = {};
    this.initLoaders();
  }

  /**
   * initializes the options and currentOptions loaders
   *
   * @memberof LogsOptionsCtrl
   */
  initLoaders() {
    this.options = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsService.getOptions(this.serviceName),
    });
    this.currentOptions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsService.getSubscribedOptionsMapGrouped(
          this.serviceName,
        ),
    });
    this.selectedOffer = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.LogsOptionsService.getOffer(this.serviceName),
    });

    this.service = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDetailService.getServiceDetails(this.serviceName).then(
          (service) => {
            if (service.state !== this.LogsConstants.SERVICE_STATE_ENABLED) {
              this.goToHomePage();
            } else {
              this.options.load();
              this.currentOptions.load();
              this.selectedOffer.load();
            }
            return service;
          },
        ),
    });
    this.service.load();
  }

  /**
   * returns the total price for all the selected options
   *
   * @returns the total price
   * @memberof LogsOptionsCtrl
   */
  getTotalPrice() {
    return reduce(
      this.options.data,
      (total, option) => total + option.quantity * option.price,
      0,
    ).toFixed(2);
  }

  /**
   * returns the list of selected options
   *
   * @returns the list of options selected for order
   * @memberof LogsOptionsCtrl
   */
  getSelectedOptions() {
    return this.LogsOptionsService.constructor.getOptionsToOrder(
      this.options.data,
    );
  }

  updateOptionToOrder(newValue, selectedOption) {
    const option = find(this.options.data, {
      planCode: selectedOption.planCode,
    });
    if (!isEmpty(option)) {
      set(option, 'quantity', newValue);
    }
  }

  /**
   * returns the current currency symbol being used
   *
   * @returns the symbol for the current currency
   * @memberof LogsOptionsCtrl
   */
  getCurrentCurrency() {
    return this.CucCurrencyService.getCurrentCurrency();
  }

  /**
   * Checks if the user has a basic offer
   *
   * @returns true if the user is subscribed to a basic offer
   * @memberof LogsOptionsCtrl
   */
  isBasicOffer() {
    return this.selectedOffer.data.reference === this.LogsConstants.basicOffer;
  }

  /**
   * takes the browser to the previously visited page
   *
   * @memberof LogsOptionsCtrl
   */
  cancel() {
    this.$window.history.back();
  }

  /**
   * opens the order page for the selected options
   *
   * @memberof LogsOptionsCtrl
   */
  order() {
    this.CucOrderHelperService.openExpressOrderUrl(
      this.LogsOptionsService.getOrderConfiguration(
        this.options.data,
        this.serviceName,
      ),
    );
  }

  goToHomePage() {
    this.$state.go('dbaas.logs.detail.home');
  }
}

angular.module('managerApp').controller('LogsOptionsCtrl', LogsOptionsCtrl);
