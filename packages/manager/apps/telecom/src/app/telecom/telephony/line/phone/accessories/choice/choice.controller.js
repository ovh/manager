import chunk from 'lodash/chunk';
import orderBy from 'lodash/orderBy';
import some from 'lodash/some';

import initializeBrandList from './choice.service';

import { MAX_QUANTITY } from './choice.constant';

export default class TelecomTelephonyLinePhoneAccessoriesChoiceCtrl {
  /* @ngInject */
  constructor($q, $translate, atInternet, TucTelephonyAccessoriesOrderProcess) {
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TucTelephonyAccessoriesOrderProcess = TucTelephonyAccessoriesOrderProcess;
  }

  $onInit() {
    this.process = null;
    this.orderTotal = null;

    this.loading = {
      init: false,
    };

    this.error = {
      loading: null,
    };

    this.accessoryToOrder = null;
    this.selectedAccessory = null;

    this.spinnerExtremities = {
      min: 0,
      max: MAX_QUANTITY,
    };

    this.getAccessories();
  }

  getAccessories() {
    this.loading.init = true;

    return this.TucTelephonyAccessoriesOrderProcess.getAvailableAccessories()
      .then(
        (orderProcess) => {
          this.process = orderProcess;
          this.brandList = initializeBrandList(this.process.accessoriesList);
          this.accessoriesDisplayed = this.process.accessoriesList;
          this.chunkedList = chunk(this.process.accessoriesList, 4);
          this.orderTotal = this.TucTelephonyAccessoriesOrderProcess.getPriceStruct(
            0,
          );
        },
        (error) => {
          this.error.loading = error;
          return this.$q.reject(error);
        },
      )
      .finally(() => {
        this.loading.init = false;
      });
  }

  hasAtLeastOneAccessory() {
    return (
      some(
        this.process.accessoriesList,
        (accessory) => accessory.quantity > 0,
      ) && !this.maxQuantity
    );
  }

  updateOrderTotal(quantity, accessoryName) {
    if (quantity <= MAX_QUANTITY) {
      const initialValue = 0;
      const total = this.process.accessoriesList.reduce(
        (totalReduce, accessory) => {
          this.maxQuantity =
            quantity > MAX_QUANTITY || accessory.quantity > MAX_QUANTITY;
          if (accessory.name === accessoryName) {
            return totalReduce + accessory.price.value * quantity;
          }
          return totalReduce + accessory.price.value * accessory.quantity;
        },
        initialValue,
      );

      this.orderTotal = this.TucTelephonyAccessoriesOrderProcess.getPriceStruct(
        total,
      );
    } else {
      this.maxQuantity = true;
    }

    // Change style of accessory to display to user what it's selected
    if (quantity > 0) {
      document.getElementById(accessoryName).className =
        'thumbnail-light-selected';
    } else {
      document.getElementById(accessoryName).className = 'thumbnail-light';
    }

    return this.orderTotal;
  }

  filterByBrand(brand) {
    if ('all'.includes(brand.toLowerCase())) {
      this.accessoriesDisplayed = this.process.accessoriesList;
    } else {
      this.accessoriesDisplayed = this.process.accessoriesList.filter((offer) =>
        offer.name.includes(brand.toLowerCase()),
      );
    }
  }

  validateStep() {
    this.process.currentView = 'shipping';
    this.atInternet.trackPage({
      name:
        'telecom::telephony::billingAccount::line::phone::accessories::delivery',
    });
    this.atInternet.trackClick({
      name:
        'telecom::telephony::billingAccount::line::phone::accessories::validate',
      type: 'action',
    });
  }

  sortPrice(order) {
    this.accessoriesDisplayed = orderBy(
      this.process.accessoriesList,
      'price.value',
      order,
    );
  }

  filterWithPhone() {
    let { brand } = this.phone;
    if (brand.includes('phone.')) {
      brand = brand.replace(/phone./, '');
    }

    // Force reinit for the accessories list
    this.process.accessoriesList = null;

    return this.TucTelephonyAccessoriesOrderProcess.getAvailableAccessoriesCompatible(
      brand,
    )
      .then((orderProcess) => {
        this.process = orderProcess;
        this.brandList = initializeBrandList(orderProcess.accessoriesList);
        this.accessoriesDisplayed = orderProcess.accessoriesList;
        this.orderTotal = this.TucTelephonyAccessoriesOrderProcess.getPriceStruct(
          0,
        );
      })
      .catch((error) => {
        this.error.loading = error;
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  filterAll() {
    // Force reinit for the accessories list
    this.process.accessoriesList = null;

    this.getAccessories();
  }

  selectAccessory() {
    this.selectedAccessory = this.accessoryToOrder;
  }
}
