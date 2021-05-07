import debounce from 'lodash/debounce';
import get from 'lodash/get';
import moment from 'moment';
import { ADDON_TYPE } from './constants';

export default class {
  /* @ngInject */
  constructor($q, $scope, $window, WebPaas, $translate) {
    this.$q = $q;
    this.$scope = $scope;
    this.$window = $window;
    this.WebPaas = WebPaas;
    this.$translate = $translate;
    this.disableNumeric = false;
    this.disableSubmit = false;
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
    const price = get(this.addon, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price.value;
    if (this.addonType === ADDON_TYPE.STORAGE) {
      const stagingQuantity = this.project.totalEnvironment();
      this.nextMonthPrice = (2 + stagingQuantity) * price * this.addon.quantity;
    } else {
      this.nextMonthPrice = price * this.addon.quantity;
    }
  }

  getTotalPrice() {
    if (this.addonType !== ADDON_TYPE.LICENCES) {
      this.totalPrice = this.nextMonthPrice * this.quantity;
    }
  }

  addStorage() {
    this.disableNumeric = true;
    this.quantity = this.presentCount + this.addon.quantity;
    this.WebPaas.getAddonSummary(this.project, this.addon, this.quantity)
      .then(({ contracts, prices, cart }) => {
        this.cart = cart;
        this.contracts = contracts;
        this.prices = prices;
        this.getNextMonthPrice();
        this.getTotalPrice();
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
        this.disableSubmit = false;
        this.disableNumeric = false;
      });
  }

  checkout() {
    this.disableNumeric = true;
    this.disableSubmit = true;
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
        this.disableSubmit = false;
        this.disableNumeric = false;
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

  onChange() {
    this.disableSubmit = true;
  }

  setParameters() {
    switch (this.addonType) {
      case ADDON_TYPE.STORAGE:
        this.presentCount =
          (this.project.totalStorage() -
            this.project.selectedPlan.getStorage()) /
          5;
        this.description = this.$translate.instant(
          'web_paas_service_add_storage_description',
          { storage: this.presentCount },
        );
        break;
      case ADDON_TYPE.ENVIRONMENNT:
        this.presentCount = this.project.totalEnvironment() - 2;
        this.description = this.$translate.instant(
          'web_paas_service_add_staging_description',
          { environment: this.presentCount },
        );
        break;
      case ADDON_TYPE.LICENCES:
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
