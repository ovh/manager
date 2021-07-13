import debounce from 'lodash/debounce';
import get from 'lodash/get';
import moment from 'moment';
import {
  ADDON_TYPE,
  STORAGE_MULTIPLE,
  DEFAULT_ENVIRONMENT_COUNT,
} from '../../web-paas.constants';

export default class {
  /* @ngInject */
  constructor($q, $scope, $window, atInternet, WebPaas, $translate) {
    this.$q = $q;
    this.$scope = $scope;
    this.$window = $window;
    this.atInternet = atInternet;
    this.WebPaas = WebPaas;
    this.$translate = $translate;
    this.disableNumeric = false;
    this.disableSubmit = true;
  }

  $onInit() {
    this.currentMonth = moment().format('MMMM');
    this.addon.quantity = 0;
    this.updateParameters();
    this.$scope.$watch(
      '$ctrl.addon.quantity',
      debounce(() => (this.addon.quantity > 0 ? this.addAddon() : null), 1000),
    );
  }

  getTotalPrice() {
    const addonPrice = get(this.addon, 'prices').find(
      (price) => price.capacities.includes('renew') && price.priceInUcents > 0,
    ).price.value;
    if (this.addonType === ADDON_TYPE.STORAGE) {
      const stagingQuantity = this.project.getTotalEnvironment();
      return stagingQuantity * addonPrice * this.quantity;
    }
    if (this.addonType === ADDON_TYPE.ENVIRONMENT) {
      return addonPrice * (this.quantity - DEFAULT_ENVIRONMENT_COUNT);
    }
    return addonPrice * this.quantity;
  }

  getNextMonthPrice() {
    const addonPrice = get(this.addon, 'prices').find(
      (price) => price.capacities.includes('renew') && price.priceInUcents > 0,
    ).price.value;
    if (this.addonType === ADDON_TYPE.STORAGE) {
      const stagingQuantity = this.project.getTotalEnvironment();
      return (
        (stagingQuantity * addonPrice * this.addon.quantity) / STORAGE_MULTIPLE
      );
    }
    return addonPrice * this.addon.quantity;
  }

  addAddon() {
    this.disableNumeric = true;

    if (this.addonType === ADDON_TYPE.STORAGE) {
      this.quantity = this.addon.quantity / STORAGE_MULTIPLE;
    }
    if (this.addon.presentQuantity > 0) {
      this.quantity =
        this.addon.presentQuantity +
        (this.addonType === ADDON_TYPE.STORAGE
          ? this.addon.quantity / STORAGE_MULTIPLE
          : this.addon.quantity);
    }

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
    this.atInternet.trackClick({
      name: `${this.trackConfirmText}-${this.quantity || this.addon.quantity}`,
      type: 'action',
    });
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
        `web_paas_service_add_addon_success_${this.addon.family}`,
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
        this.presentCount = this.project.addonStorageCount();
        this.description = this.$translate.instant(
          'web_paas_service_add_storage_description',
          { storage: this.presentCount * STORAGE_MULTIPLE },
        );
        this.trackCancelText = `${this.trackTextPrefix}upgrade-storage::cancel`;
        this.trackConfirmText = `${this.trackTextPrefix}upgrade-storage::confirm`;
        break;
      case ADDON_TYPE.ENVIRONMENT:
        this.presentCount = this.project.getTotalEnvironment();
        this.description = this.$translate.instant(
          'web_paas_service_add_staging_description',
          { environment: this.presentCount },
        );
        this.trackCancelText = `${this.trackTextPrefix}setup-additional-environments::cancel`;
        this.trackConfirmText = `${this.trackTextPrefix}setup-additional-environments::confirm`;
        break;
      case ADDON_TYPE.LICENCES:
        this.presentCount = this.project.addonUserLicencesCount();
        this.description = `${this.$translate.instant(
          'web_paas_service_add_license_description1',
          {
            addonLicenses: this.presentCount,
            offerName: this.project.selectedPlan.getRange(),
            maxLicences: this.project.selectedPlan.getLicences(),
          },
        )} ${this.$translate.instant(
          this.presentCount > 1
            ? 'web_paas_service_add_license_description_licence_plural'
            : 'web_paas_service_add_license_description_licence_singular',
        )} ${this.$translate.instant(
          'web_paas_service_add_license_description2',
        )}`;
        this.trackCancelText = `${this.trackTextPrefix}setup-additional-licences::cancel`;
        this.trackConfirmText = `${this.trackTextPrefix}upgrade-licences::confirm`;
        break;

      default:
        break;
    }
  }

  cancel() {
    this.atInternet.trackClick({
      name: this.trackCancelText,
      type: 'action',
    });
    return this.goBack();
  }
}
