import debounce from 'lodash/debounce';
import get from 'lodash/get';
import moment from 'moment';
import { ADDON_TYPE } from '../service.constants';
import { STORAGE_MULTIPLE } from './constants';

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
    this.updateParameters();
    this.$scope.$watch(
      '$ctrl.addon.quantity',
      debounce(() => (this.addon.quantity > 0 ? this.addAddon() : null), 1000),
    );
  }

  getTotalPrice() {
    const price = get(this.addon, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price.value;
    if (this.addonType === ADDON_TYPE.STORAGE) {
      const stagingQuantity = this.project.getTotalEnvironment();
      return (2 + stagingQuantity) * price * this.quantity;
    }
    return price * this.quantity;
  }

  getNextMonthPrice() {
    const price = get(this.addon, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price.value;
    return price * this.addon.quantity;
  }

  addAddon() {
    this.disableNumeric = true;
    this.quantity =
      this.presentCount +
      (this.addonType === ADDON_TYPE.STORAGE
        ? this.addon.quantity / STORAGE_MULTIPLE
        : this.addon.quantity);
    this.WebPaas.getAddonSummary(this.project, this.addon, this.quantity)
      .then(({ contracts, prices, cart }) => {
        this.cart = cart;
        this.contracts = contracts;
        this.prices = prices;
        this.nextMonthPrice = this.getNextMonthPrice();
        this.totalPrice = this.getTotalPrice();
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

  orderAddon() {
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
    if (checkout?.prices?.withTaxValue > 0) {
      this.$window.open(checkout.url, '_blank', 'noopener');
    }

    this.goBack(
      this.$translate.instant(
        `web_paas_service_add_addon_success_${this.addonType.family}`,
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

  updateParameters() {
    switch (this.addonType) {
      case ADDON_TYPE.STORAGE:
        this.presentCount =
          (this.project.getTotalStorage() -
            this.project.selectedPlan.getStorage()) /
          5;
        this.description = this.$translate.instant(
          'web_paas_service_add_storage_description',
          { storage: this.presentCount },
        );
        break;
      case ADDON_TYPE.ENVIRONMENNT:
        this.presentCount = this.project.getTotalEnvironment() - 2;
        this.description = this.$translate.instant(
          'web_paas_service_add_staging_description',
          { environment: this.presentCount },
        );
        break;
      case ADDON_TYPE.LICENCES:
        this.presentCount =
          this.project.getTotalLicences() -
          this.project.selectedPlan.getLicences();
        this.description = `${this.$translate.instant(
          'web_paas_service_add_license_description1',
          {
            license: this.presentCount,
            offerName: this.project.selectedPlan.getRange(),
            maxLicences: this.project.selectedPlan.getMaxLicenses(),
          },
        )} ${this.$translate.instant(
          this.presentCount > 1
            ? 'web_paas_service_add_license_description_licence_plural'
            : 'web_paas_service_add_license_description_licence_singular',
        )} ${this.$translate.instant(
          'web_paas_service_add_license_description2',
        )}`;
        break;

      default:
        break;
    }
  }
}
