import debounce from 'lodash/debounce';
import get from 'lodash/get';
import moment from 'moment';

export default class {
  /* @ngInject */
  constructor($q, $scope, $window, Alerter, WebPaas, $translate) {
    this.$q = $q;
    this.$scope = $scope;
    this.$window = $window;
    this.Alerter = Alerter;
    this.WebPaas = WebPaas;
    this.$translate = $translate;
    this.disabled = false;
  }

  $onInit() {
    this.currentMonth = moment().format('MMMM');
    this.setParameters();
    this.$scope.$watch(
      '$ctrl.addon.quantity',
      debounce(
        () => (this.addon.quantity > 0 ? this.addStorage() : null),
        1000,
      ),
    );
  }

  getNextMonthPrice() {
    this.nextMonthPrice =
      get(this.addon, 'prices').find(({ capacities }) =>
        capacities.includes('renew'),
      ).price.value * this.addon.quantity;
  }

  addStorage() {
    this.disabled = true;
    this.quantity = this.presentCount + this.addon.quantity;
    this.WebPaas.getAddonSummary(this.project, this.addon, this.quantity)
      .then(({ contracts, prices, cart }) => {
        this.getNextMonthPrice();
        this.cart = cart;
        this.contracts = contracts;
        this.prices = prices;
        if (this.addonType !== 'additional-user-license') {
          this.totalPrice = this.nextMonthPrice * this.quantity;
        }
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('web_paas_service_add_addon_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.disabled = false;
      });
  }

  checkout() {
    this.disabled = true;
    this.WebPaas.checkoutAddon(
      this.cart,
      this.project.serviceId,
      this.addon,
      this.quantity,
    )
      .then(({ order }) => this.onAddonOrderSuccess(order))
      .catch((error) =>
        this.goBack(
          this.$translate.instant('web_paas_service_add_addon_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.disabled = false;
      });
  }

  onAddonOrderSuccess(checkout) {
    if (checkout && checkout.prices && checkout.prices.withTax.value > 0) {
      this.$window.open(checkout.url, '_blank', 'noopener');
    }

    this.goBack(
      this.$translate.instant(
        `web_paas_service_add_addon_success_${this.addonType.split('-').pop()}`,
        {
          orderURL: checkout ? this.getOrderUrl(checkout.orderId) : null,
        },
      ),
      'success',
    );
  }

  setParameters() {
    switch (this.addonType) {
      case 'additional-storage':
        this.presentCount =
          (this.project.totalStorage() -
            this.project.selectedPlan.getStorage()) /
          5;
        this.description = this.$translate.instant(
          'web_paas_service_add_storage_description',
          { storage: this.presentCount },
        );
        break;
      case 'additional-staging-environment':
        this.presentCount = this.project.totalEnvironment() - 2;
        this.description = this.$translate.instant(
          'web_paas_service_add_staging_description',
          { environment: this.presentCount },
        );
        break;
      case 'additional-user-license':
        this.presentCount =
          this.project.totalLicences() -
          this.project.selectedPlan.getLicences();
        this.description = this.$translate.instant(
          'web_paas_service_add_license_description',
          {
            license: this.presentCount,
            offerName: this.project.selectedPlan.getRange(),
            maxLicences: this.project.selectedPlan.getMaxLicenses(),
          },
        );
        break;

      default:
        break;
    }
  }
}
