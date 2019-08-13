angular.module('managerApp').controller('PackVoipLineActivationCtrl', function ($scope, $stateParams, OvhApiPackXdsl, OvhApiPackXdslVoipLine, costs, $q, $translate, TucToastError) {
  const self = this;
  this.transporterCost = costs.voip.shipping.transporter.value;
  this.canUncheckOrderablePhones = true;

  /**
    * Build the select object
    * @param {Integer} count Number of available slots
    */
  this.buildSlotCount = function (count) {
    if (count > 1) {
      self.orderCountSelect.push({
        value: 0,
        label: $translate.instant('telephony_activation_select_number_of_lines'),
      });
    }

    for (let j = 0; j < count; j += 1) {
      self.orderCountSelect.push({
        value: j + 1,
        label: j + 1,
      });
    }

    if (self.orderCountSelect.length === 1) {
      self.setOrderCount(1, true);
    } else {
      self.setOrderCount(0, true);
    }
  };

  /**
    * Load lines and hardware data
    * @param {Integer} id Pack id
    * @returns {Promise}
    */
  this.loadData = function (id) {
    self.loading = true;
    return $q.all([
      OvhApiPackXdsl.v6().getServices({
        packId: id,
      }).$promise,
      OvhApiPackXdslVoipLine.v6().getHardwares({
        packId: id,
      }).$promise,
      OvhApiPackXdslVoipLine.v6().getShippingAddresses({
        packId: id,
      }).$promise,
    ]).finally(() => {
      self.loading = false;
    });
  };

  /**
    * Build an array of large x n elements
    * @param    {array} arrayData Input data (flat array)
    * @param  {Integer} largeParam     Array large
    * @param {function} callbackParam  Function to format data. if the function return false,
    *                                  data are ignored
    * @returns {Array}
    */
  this.buildFramedObject = function (arrayData, largeParam, callbackParam) {
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
      callback = function (val) {
        return val;
      };
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
  };

  /**
    * Check if the user still can uncheck the orderable phones.
    * And keep coherence between the flag needHardware and the selected
    * hardware.
    * Aka: if not needed, hardware must be null.
    */
  this.checkIfStillCanUncheckOrderablePhones = function () {
    const uncheckedPhones = _.sum(_.map(_.flatten(self.framedLines), (framedLine) => {
      if (!framedLine.line.needHardware && framedLine.line.hardware) {
        _.set(framedLine, 'line.hardware', null);
      }

      return framedLine.line.needHardware ? 0 : 1;
    }));

    self.canUncheckOrderablePhones = uncheckedPhones < self.modem.linesOnModem;
  };

  /**
    * Set the number of hardware to order
    * @param {Integer} number Number of hardware to order
    */
  this.setOrderCount = function (number, isInitialSelection) {
    if (typeof number !== 'undefined') {
      self.orderCount = _.find(self.orderCountSelect, { value: number });
    }

    if (!isInitialSelection && self.orderCountSelect[0] && self.orderCountSelect[0].value === 0) {
      // remove the placeholder
      self.orderCountSelect.shift();
    }

    self.modem.lines.forEach((line, index) => {
      _.set(line, 'enabled', index < self.orderCount.value);
    });

    self.framedLines = self.buildFramedObject(self.modem.lines, 2, (line, localIndex) => {
      if (!line.enabled) {
        return false;
      }
      return {
        line,
        carouselIndex: 0,
        availableHardwares: JSON.parse(JSON.stringify(self.hardwares)),
        index: localIndex + 1,
      };
    });

    self.checkIfStillCanUncheckOrderablePhones();
  };

  /**
    * Remove Dupplicate address
    * @param {array} data List of addresses
    * @returns {array}
    */
  this.removeDuplicateAddress = function (dataParam) {
    let sameAddress = true;
    let data = dataParam;
    _.forEach(_.keys(_.pick(data[0], ['firstName', 'zipCode', 'cityName', 'lastName', 'address', 'countryCode'])), (key) => {
      if (_.isString(data[0][key]) && _.isString(data[1][key])) {
        if (data[0][key].toLowerCase() !== data[1][key].toLowerCase()) {
          sameAddress = false;
        }
      } else if (data[0][key] !== data[1][key]) {
        sameAddress = false;
      }
    });
    if (sameAddress) {
      data = _.drop(data, 1);
    }
    return data;
  };

  /**
    * Check if all hardware are configured
    * @returns {boolean} True if ready
    */
  this.isHardwareConfigured = function () {
    if (self.modem.lines) {
      let ready = true;
      self.modem.lines.forEach((line) => {
        if (!line.isConfigured()) {
          ready = false;
        }
      });
      return ready;
    }
    return false;
  };

  /**
    * Check if something needs to be shipped
    * @returns {boolean} True if ready
    */
  this.isShipping = function () {
    if (self.modem.lines) {
      let shipping = false;
      self.modem.lines.forEach((line) => {
        if (line.isShipping()) {
          shipping = true;
        }
      });
      return shipping;
    }
    return true;
  };

  /**
    * Check if transport is configured
    * @returns {boolean} True if ready
    */
  this.isTransportConfigured = function () {
    switch (self.shippingMode) {
      case 'mondialRelay':
        return !!self.mondialRelay;
      case 'transporter':
        return !!self.transporterAddress;
      default:
        return false;
    }
  };

  this.getTransporter = function () {
    switch (self.shippingMode) {
      case 'mondialRelay':
        return {
          mondialRelayId: self.mondialRelay.id,
        };
      case 'transporter':
        return {
          shippingId: self.transporterAddress,
        };
      default:
        return {};
    }
  };

  /**
    * Check if the order is ready
    * @returns {boolean}
    */
  this.isOrderReady = function () {
    const needNoHardware = self.isHardwareConfigured() && !self.isShipping();
    const needHardware = self.isHardwareConfigured() && self.isShipping()
      && self.isTransportConfigured();
    return needNoHardware || needHardware;
  };

  /**
    * Launch a new Order
    */
  this.launchOrder = function () {
    self.orderPending = true;
    const data = [];
    self.modem.lines.forEach((line) => {
      if (line.isShipping()) {
        data.push(angular.extend({ hardwareName: line.hardware.name }, self.getTransporter()));
      } else if (line.enabled) {
        data.push({ hardwareName: 'modem' });
      }
    });
    OvhApiPackXdslVoipLine.Aapi().activate({
      packId: $stateParams.packName,
    }, { lines: data }).$promise.then((order) => {
      self.orderDone = true;
      self.orderDetails = _.first(order.data);
    }, (err) => {
      self.orderDone = false;
      self.orderError = err;
      return new TucToastError(err);
    }).finally(() => {
      self.orderPending = false;
    });
  };

  /**
    * Initialize the controller
    */
  this.init = function () {
    self.shippingMode = 'mondialRelay';
    self.mondialRelay = null;
    self.bill = {
      deposit() {
        let deposit = 0;
        if (self.modem.lines) {
          self.modem.lines.forEach((line) => {
            if (line.enabled && line.hardware) {
              deposit += line.hardware.deposit.value;
            }
          });
        }
        return deposit;
      },
      transportCost() {
        return (self.shippingMode === 'mondialRelay') || !self.isShipping() ? 0 : costs.voip.shipping.transporter.value;
      },
      total() {
        return this.deposit() + this.transportCost();
      },
    };
    self.modem = {};
    self.orderCountSelect = [];
    self.framedLines = [];
    self.loadData($stateParams.packName).then((data) => {
      self.modem.availableSlots = _.find(data[0], { name: 'voipLine' });

      self.hardwares = data[1]; // eslint-disable-line
      const linesOnModems = _.remove(self.hardwares, { name: 'modem' });
      if (linesOnModems && _.isArray(linesOnModems)) {
        self.modem.linesOnModem = linesOnModems.length ? linesOnModems[0].max : 0;
      }

      self.modem.lines = [];
      for (let i = 0; i < self.modem.availableSlots.available; i += 1) {
        self.modem.lines.push({
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

      self.buildSlotCount(self.modem.availableSlots.available);

      self.shippingAddresses = self.removeDuplicateAddress(data[2]);
      self.framedShippingAddresses = self.buildFramedObject(self.shippingAddresses);
    }, TucToastError);
  };

  this.init();
});
