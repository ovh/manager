import head from 'lodash/head';

export default class {
  /* @ngInject */
  constructor($translate, ovhManagerPccLicenseEnableService, User) {
    this.$translate = $translate;
    this.ovhManagerPccLicenseEnableService = ovhManagerPccLicenseEnableService;
    this.User = User;
  }

  $onInit() {
    this.bindings = {
      contracts: {
        areSigned: undefined,
        value: undefined,
      },
      form: {
        isValid: undefined,
      },
      offers: {
        selected: undefined,
        value: undefined,
      },
    };

    this.selectedOffer = null;

    return this.fetchInitialData();
  }

  fetchInitialData() {
    this.bindings.isLoading = true;

    return this.fetchExpressOrderURL()
      .then(() => this.fetchOVHSubsidiary())
      .then(() => this.fetchOffers())
      .then(() => this.fetchContracts())
      .catch((error) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_tab_licences_active_spla_load_fail',
          )}: ${error.message || error}`,
          'danger',
        );
      })
      .finally(() => {
        this.bindings.isLoading = false;
      });
  }

  fetchExpressOrderURL() {
    return this.User.getUrlOf('express_order').then((url) => {
      this.expressOrderUrl = url;
    });
  }

  fetchOVHSubsidiary() {
    return this.User.getUser().then(({ ovhSubsidiary }) => {
      this.ovhSubsidiary = ovhSubsidiary;
    });
  }

  fetchOffers() {
    return this.ovhManagerPccLicenseEnableService
      .fetchOffers(this.dedicatedCloud.serviceName)
      .then((offers) => {
        this.bindings.offers = {
          value: offers,
        };
      });
  }

  fetchContracts() {
    return this.ovhManagerPccLicenseEnableService
      .fetchContracts(
        head(this.bindings.offers.value),
        this.dedicatedCloud,
        this.ovhSubsidiary,
      )
      .then((contracts) => {
        this.bindings.contracts.value = contracts;
        if (!contracts.length) {
          this.bindings.contracts.areSigned = true;
        }
      });
  }

  isOrderButtonAvailable() {
    return (
      this.bindings.offers.selected != null && this.bindings.contracts.areSigned
    );
  }

  getOrderUrl() {
    if (!this.isOrderButtonAvailable()) {
      return undefined;
    }

    const price = head(this.bindings.offers.selected.prices);

    return `${this.expressOrderUrl}review?products=${JSURL.stringify([
      {
        productId: 'privateCloud',
        serviceName: this.dedicatedCloud.serviceName,
        planCode: this.bindings.offers.selected.planCode,
        duration: price.duration,
        pricingMode: price.pricingMode,
        quantity: 1,
      },
    ])}`;
  }
}
