import angular from 'angular';
import drop from 'lodash/drop';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import keys from 'lodash/keys';
import map from 'lodash/map';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import set from 'lodash/set';
import sum from 'lodash/sum';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    OvhApiPackXdsl,
    OvhApiPackXdslVoipLine,
    costs,
    $q,
    $translate,
    TucToastError,
  ) {
    this.$stateParams = $stateParams;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiPackXdslVoipLine = OvhApiPackXdslVoipLine;
    this.costs = costs;
    this.$q = $q;
    this.$translate = $translate;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.transporterCost = this.costs.voip.shipping.transporter.value;
    this.canUncheckOrderablePhones = true;
    this.shippingMode = 'mondialRelay';
    this.mondialRelay = null;
    this.bill = {
      deposit() {
        let deposit = 0;
        if (this.modem.lines) {
          this.modem.lines.forEach((line) => {
            if (line.enabled && line.hardware) {
              deposit += line.hardware.deposit.value;
            }
          });
        }
        return deposit;
      },
      transportCost() {
        return (this.shippingMode === 'mondialRelay') || !this.isShipping() ? 0 : this.costs.voip.shipping.transporter.value;
      },
      total() {
        return this.deposit() + this.transportCost();
      },
    };
    this.modem = {};
    this.orderCountSelect = [];
    this.framedLines = [];
    this.loadData(this.$stateParams.packName).then((data) => {
      this.modem.availableSlots = find(data[0], { name: 'voipLine' });

      this.hardwares = data[1]; // eslint-disable-line
      const linesOnModems = remove(this.hardwares, { name: 'modem' });
      if (linesOnModems && isArray(linesOnModems)) {
        this.modem.linesOnModem = linesOnModems.length ? linesOnModems[0].max : 0;
      }

      this.modem.lines = [];
      for (let i = 0; i < this.modem.availableSlots.available; i += 1) {
        this.modem.lines.push({
          hardware: null,
          enabled: true,
          needHardware: true,
          isShipping() {
            return !!this.needHardware && !!this.enabled;
          },
          isConfigured() {
            return !this.enabled || !this.needHardware
              || (!!this.needHardware && !!this.enabled && !!this.hardware);
          },
        });
      }

      this.buildSlotCount(this.modem.availableSlots.available);

      this.shippingAddresses = this.removeDuplicateAddress(data[2]);
      this.framedShippingAddresses = this.buildFramedObject(this.shippingAddresses);
    }, this.TucToastError);
  }

  /**
    * Build the select object
    * @param {Integer} count Number of available slots
    */
  buildSlotCount(count) {
    if (count > 1) {
      this.orderCountSelect.push({
        value: 0,
        label: this.$translate.instant('telephony_activation_select_number_of_lines'),
      });
    }

    for (let j = 0; j < count; j += 1) {
      this.orderCountSelect.push({
        value: j + 1,
        label: j + 1,
      });
    }

    if (this.orderCountSelect.length === 1) {
      this.setOrderCount(1, true);
    } else {
      this.setOrderCount(0, true);
    }
  }

  /**
    * Load lines and hardware data
    * @param {Integer} id Pack id
    * @returns {Promise}
    */
  loadData(id) {
    this.loading = true;
    return this.$q.all([
      this.OvhApiPackXdsl.v6().getServices({
        packId: id,
      }).$promise,
      this.OvhApiPackXdslVoipLine.v6().getHardwares({
        packId: id,
      }).$promise,
      this.OvhApiPackXdslVoipLine.v6().getShippingAddresses({
        packId: id,
      }).$promise,
    ]).finally(() => {
      this.loading = false;
    });
  }

  /**
    * Build an array of large x n elements
    * @param    {array} arrayData Input data (flat array)
    * @param  {Integer} largeParam     Array large
    * @param {function} callbackParam  Function to format data. if the function return false,
    *                                  data are ignored
    * @returns {Array}
    */
  static buildFramedObject(arrayData, largeParam, callbackParam) {
    const framedData = [];
    let localIndex = 0;
    let callback = callbackParam;
    let large = largeParam;
    if (typeof large === 'function') {
      callback = large;
    }
    if ((typeof large === 'undefined') || (typeof large === 'function')) {
      large = 2;
    }
    if (typeof callback === 'undefined') {
      callback = val => val;
    }
    arrayData.forEach((data, index) => {
      const computedData = callback(data, localIndex, index);
      if (computedData !== false) {
        if (framedData.length <= Math.floor(localIndex / large)) {
          framedData[Math.floor(localIndex / large)] = [];
        }
        framedData[Math.floor(localIndex / 2)][localIndex % 2] = computedData;
        localIndex += 1;
      }
    });
    return framedData;
  }

  /**
    * Check if the user still can uncheck the orderable phones.
    * And keep coherence between the flag needHardware and the selected
    * hardware.
    * Aka: if not needed, hardware must be null.
    */
  checkIfStillCanUncheckOrderablePhones() {
    const uncheckedPhones = sum(map(flatten(this.framedLines), (framedLine) => {
      if (!framedLine.line.needHardware && framedLine.line.hardware) {
        set(framedLine, 'line.hardware', null);
      }

      return framedLine.line.needHardware ? 0 : 1;
    }));

    this.canUncheckOrderablePhones = uncheckedPhones < this.modem.linesOnModem;
  }

  /**
    * Set the number of hardware to order
    * @param {Integer} number Number of hardware to order
    */
  setOrderCount(number, isInitialSelection) {
    if (typeof number !== 'undefined') {
      this.orderCount = find(this.orderCountSelect, { value: number });
    }

    if (!isInitialSelection && this.orderCountSelect[0] && this.orderCountSelect[0].value === 0) {
      // remove the placeholder
      this.orderCountSelect.shift();
    }

    this.modem.lines.forEach((line, index) => {
      set(line, 'enabled', index < this.orderCount.value);
    });

    this.framedLines = this.buildFramedObject(this.modem.lines, 2, (line, localIndex) => {
      if (!line.enabled) {
        return false;
      }
      return {
        line,
        carouselIndex: 0,
        availableHardwares: JSON.parse(JSON.stringify(this.hardwares)),
        index: localIndex + 1,
      };
    });

    this.checkIfStillCanUncheckOrderablePhones();
  }

  /**
    * Remove Dupplicate address
    * @param {array} data List of addresses
    * @returns {array}
    */
  static removeDuplicateAddress(dataParam) {
    let sameAddress = true;
    let data = dataParam;
    forEach(keys(pick(data[0], ['firstName', 'zipCode', 'cityName', 'lastName', 'address', 'countryCode'])), (key) => {
      if (isString(data[0][key]) && isString(data[1][key])) {
        if (data[0][key].toLowerCase() !== data[1][key].toLowerCase()) {
          sameAddress = false;
        }
      } else if (data[0][key] !== data[1][key]) {
        sameAddress = false;
      }
    });
    if (sameAddress) {
      data = drop(data, 1);
    }
    return data;
  }

  /**
    * Check if all hardware are configured
    * @returns {boolean} True if ready
    */
  isHardwareConfigured() {
    if (this.modem.lines) {
      let ready = true;
      this.modem.lines.forEach((line) => {
        if (!line.isConfigured()) {
          ready = false;
        }
      });
      return ready;
    }
    return false;
  }

  /**
    * Check if something needs to be shipped
    * @returns {boolean} True if ready
    */
  isShipping() {
    if (this.modem.lines) {
      let shipping = false;
      this.modem.lines.forEach((line) => {
        if (line.isShipping()) {
          shipping = true;
        }
      });
      return shipping;
    }
    return true;
  }

  /**
    * Check if transport is configured
    * @returns {boolean} True if ready
    */
  isTransportConfigured() {
    switch (this.shippingMode) {
      case 'mondialRelay':
        return !!this.mondialRelay;
      case 'transporter':
        return !!this.transporterAddress;
      default:
        return false;
    }
  }

  getTransporter() {
    switch (this.shippingMode) {
      case 'mondialRelay':
        return {
          mondialRelayId: this.mondialRelay.id,
        };
      case 'transporter':
        return {
          shippingId: this.transporterAddress,
        };
      default:
        return {};
    }
  }

  /**
    * Check if the order is ready
    * @returns {boolean}
    */
  isOrderReady() {
    const needNoHardware = this.isHardwareConfigured() && !this.isShipping();
    const needHardware = this.isHardwareConfigured() && this.isShipping()
      && this.isTransportConfigured();
    return needNoHardware || needHardware;
  }

  /**
    * Launch a new Order
    */
  launchOrder() {
    this.orderPending = true;
    const data = [];
    this.modem.lines.forEach((line) => {
      if (line.isShipping()) {
        data.push(angular.extend({ hardwareName: line.hardware.name }, this.getTransporter()));
      } else if (line.enabled) {
        data.push({ hardwareName: 'modem' });
      }
    });
    this.OvhApiPackXdslVoipLine.Aapi().activate({
      packId: this.$stateParams.packName,
    }, { lines: data }).$promise.then((order) => {
      this.orderDone = true;
      this.orderDetails = head(order.data);
    }, (err) => {
      this.orderDone = false;
      this.orderError = err;
      return new this.TucToastError(err);
    }).finally(() => {
      this.orderPending = false;
    });
  }
}
