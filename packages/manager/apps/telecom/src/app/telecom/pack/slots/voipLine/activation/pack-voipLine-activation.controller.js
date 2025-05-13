import find from 'lodash/find';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import remove from 'lodash/remove';
import orderBy from 'lodash/orderBy';
import set from 'lodash/set';
import sum from 'lodash/sum';
import uniqWith from 'lodash/uniqWith';

import { TELECOM_VOIP_ACTIVATION } from './pack-voipLine-activation.constant';

export default class PackVoipLineActivationCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $translate,
    atInternet,
    costs,
    OvhApiPackXdsl,
    OvhApiPackXdslVoipLine,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiPackXdslVoipLine = OvhApiPackXdslVoipLine;
    this.costs = costs;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.transporterCost = this.costs.voip.shipping.transporter.value;
    this.currency = this.costs.voip.shipping.transporter.currencyCode;
    this.canUncheckOrderablePhones = true;

    this.isFirstSelect = true;

    this.shippingMode = TELECOM_VOIP_ACTIVATION.shippingMode.mondialRelay;
    this.mondialRelay = null;
    this.phoneBill = {
      deposit: 0,
      fees: 0,
      transportCost: 0,
      total: 0,
    };
    this.modem = {};
    this.orderCountSelect = [];
    this.framedLines = [];

    this.phoneToOrder = null;
    this.isSipOnly = false;
    this.isFilteredByBrand = false;

    this.loadData(this.packName).then((data) => {
      this.modem.availableSlots = find(data[0], { name: 'voipLine' });

      // eslint-disable-next-line prefer-destructuring
      this.hardwares = data[1];

      // initialize brand list for tabs
      this.initializeBrandList();

      // initialize previous quantity for sip line only
      this.prevQuantitySipOnly = 0;

      const linesOnModems = remove(this.hardwares, { name: 'modem' });
      if (linesOnModems && isArray(linesOnModems)) {
        // Add this choice to hardwares list
        if (linesOnModems.length > 0) {
          this.isSipLineAvailable = true;
        } else {
          this.isSipLineAvailable = false;
        }

        this.modem.linesOnModem = linesOnModems.length
          ? linesOnModems[0].max
          : 0;
      }

      this.selectedPhones = [];

      // Set lines for modem
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
            return (
              !this.enabled ||
              !this.needHardware ||
              (!!this.needHardware && !!this.enabled && !!this.hardware)
            );
          },
        });
      }

      this.buildSlotCount(this.modem.availableSlots.available);

      // Remove duplicate addresses
      this.shippingAddresses = uniqWith(data[2], isEqual);
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
        label: this.$translate.instant(
          'telephony_activation_select_number_of_lines',
        ),
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
    return this.$q
      .all([
        this.OvhApiPackXdsl.v6().getServices({
          packId: id,
        }).$promise,
        this.OvhApiPackXdslVoipLine.v6().getHardwares({
          packId: id,
        }).$promise,
        this.OvhApiPackXdslVoipLine.v6().getShippingAddresses({
          packId: id,
        }).$promise,
      ])
      .finally(() => {
        this.loading = false;
      });
  }

  /**
   * Check if the user still can uncheck the orderable phones.
   * And keep coherence between the flag needHardware and the selected
   * hardware.
   * Aka: if not needed, hardware must be null.
   */
  checkIfStillCanUncheckOrderablePhones() {
    const uncheckedPhones = sum(
      map(this.modem.lines, (line) => {
        return line.needHardware ? 0 : 1;
      }),
    );

    this.canUncheckOrderablePhones = uncheckedPhones < this.modem.linesOnModem;
  }

  /**
   * Set the number of hardware to order
   * @param {Integer} number Number of hardware to order
   */
  setOrderCount(number, isInitialSelection) {
    this.selectedPhones = [];
    if (typeof number !== 'undefined') {
      this.orderCount = find(this.orderCountSelect, { value: number });
    }

    if (
      !isInitialSelection &&
      this.orderCountSelect[0] &&
      this.orderCountSelect[0].value === 0
    ) {
      // remove the placeholder
      this.orderCountSelect.shift();
    }

    this.modem.lines.forEach((line, index) => {
      set(line, 'enabled', index < this.orderCount.value);
    });

    this.spinnerExtremities = {
      min: 0,
      max: this.orderCount.value,
    };
    this.quantityMax = 0;

    this.isFirstSelect = true;
    this.checkIfStillCanUncheckOrderablePhones();
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
    if (this.selectedPhones) {
      let shipping = false;
      this.selectedPhones.forEach((line) => {
        if (line.needShipping && !this.isSipOnly) {
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
      case TELECOM_VOIP_ACTIVATION.shippingMode.mondialRelay:
        return !!this.mondialRelay;
      case TELECOM_VOIP_ACTIVATION.shippingMode.transporter:
        return !!this.transporterAddress;
      default:
        return false;
    }
  }

  getTransporter() {
    switch (this.shippingMode) {
      case TELECOM_VOIP_ACTIVATION.shippingMode.mondialRelay:
        return {
          mondialRelayId: this.mondialRelay.id,
        };
      case TELECOM_VOIP_ACTIVATION.shippingMode.transporter:
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
    let nbLinesConfigured = 0;
    this.selectedPhones.forEach((line) => {
      if (line) {
        nbLinesConfigured += line.quantity;
      }
    });
    const needHardware =
      nbLinesConfigured === this.orderCount.value &&
      this.isShipping() &&
      this.isTransportConfigured();
    const needNoHardware = this.isHardwareConfigured() && !this.isShipping();

    return needNoHardware || needHardware;
  }

  /**
   * Launch a new Order
   */
  launchOrder() {
    this.orderPending = true;
    const data = [];
    this.selectedPhones.forEach((line) => {
      if (line.needShipping) {
        for (let i = 0; i < line.quantity; i += 1) {
          data.push(
            angular.extend({ hardwareName: line.name }, this.getTransporter()),
          );
        }
      } else if (line.enabled) {
        data.push({ hardwareName: 'modem' });
      }
    });
    this.OvhApiPackXdslVoipLine.Aapi()
      .activate(
        {
          packId: this.packName,
        },
        { lines: data },
      )
      .$promise.then(
        (order) => {
          this.orderDone = true;
          this.orderDetails = head(order.data);
        },
        (err) => {
          this.orderDone = false;
          this.orderError = err;
          return new this.TucToastError(err);
        },
      )
      .finally(() => {
        this.orderPending = false;
      });
    this.atInternet.trackClick({
      name: 'telecom::packs::pack::voipLine-activation::validate',
      type: 'action',
    });
  }

  initializeBrandList() {
    let brands = this.hardwares.map((offer) => {
      let brand = offer.name.substring(0, offer.name.indexOf('.'));
      if (brand) {
        brand = brand.replace(/^./, brand[0].toUpperCase());
      }
      return brand;
    });
    brands = brands
      .filter((offer) => offer) // remove empty brand
      .filter((offer, index) => brands.indexOf(offer) === index);
    this.brandList = ['All', ...brands];
  }

  filterByBrand(brand) {
    if ('all'.includes(brand.toLowerCase())) {
      this.phonesDisplayed = this.hardwares;
      this.isFilteredByBrand = false;
    } else {
      this.phonesDisplayed = this.hardwares.filter((offer) =>
        offer.name.includes(brand.toLowerCase()),
      );
      this.isFilteredByBrand = true;
    }
  }

  sortPrice(order) {
    this.phonesDisplayed = orderBy(this.hardwares, 'deposit.value', order);
  }

  // Available only for 1 line to activate
  selectPhone(phone) {
    if (this.orderCount.value === 1) {
      const line = phone;
      line.quantity = 1;
      this.selectedPhones[0] = line;
      this.updatePhoneBill();

      this.isSipOnly = false;
    }
    this.selectedPhone = this.phoneToOrder;
  }

  updateOrderTotal(quantity, phone) {
    this.errorQuantity = false;

    if (phone !== TELECOM_VOIP_ACTIVATION.sipLine) {
      if (this.selectedPhones.length === 0 && quantity > 0) {
        const line = phone;
        line.quantity = quantity;
        this.selectedPhones.push(line);
      } else {
        let notFound = true;
        this.selectedPhones.forEach((select) => {
          const updated = select;
          if (updated.name === phone.name) {
            updated.quantity = quantity;
            notFound = false;
          }
          return updated;
        });
        if (notFound) {
          const line = phone;
          line.quantity = quantity;
          this.selectedPhones.push(line);
        }
      }
    } else if (quantity > 0) {
      const index = quantity - 1;
      const line = this.modem.lines[index];
      if (quantity > this.prevQuantitySipOnly) {
        // order SIP line only
        line.needHardware = false;
        line.isShipping = false;
        this.selectedPhones.push(line);
      } else if (quantity < this.prevQuantitySipOnly) {
        // remove SIP line only
        this.selectedPhones = this.selectedPhones.filter(
          (select) => select !== line,
        );
      }
      this.checkIfStillCanUncheckOrderablePhones();
      this.prevQuantitySipOnly = quantity;
    } else {
      // remove SIP line only
      this.selectedPhones = this.selectedPhones.filter((select) => {
        if (select.name) {
          return true;
        }
        return false;
      });
      this.checkIfStillCanUncheckOrderablePhones();
      this.prevQuantitySipOnly = quantity;
    }

    this.updatePhoneBill();

    // Check quantity
    let q = 0;
    let qSipOnly = 0;
    this.selectedPhones.forEach((line) => {
      if (line) {
        if (line.quantity) {
          q += line.quantity;
        }
        if (line.enabled) {
          q += 1;
          qSipOnly += 1;
        }
      }
    });
    if (q > this.orderCount.value) {
      this.errorQuantity = true;
    }
    if (qSipOnly === this.orderCount.value) {
      this.isSipOnly = true;
    } else {
      this.isSipOnly = false;
    }

    // Change style of phone to display to user what it's selected
    if (quantity > 0) {
      switch (phone) {
        case TELECOM_VOIP_ACTIVATION.sipLine:
          document.getElementById(TELECOM_VOIP_ACTIVATION.sipLine).className =
            'thumbnail-light-selected';
          break;
        default:
          document.getElementById(phone.name).className =
            'thumbnail-light-selected';
          break;
      }
    } else {
      switch (phone) {
        case TELECOM_VOIP_ACTIVATION.sipLine:
          document.getElementById(TELECOM_VOIP_ACTIVATION.sipLine).className =
            'thumbnail-light';
          break;
        default:
          document.getElementById(phone.name).className = 'thumbnail-light';
          break;
      }
    }
  }

  updatePhoneBill() {
    let deposit = 0;
    let fees = 0;
    if (this.selectedPhones && this.selectedPhones.length > 0) {
      this.selectedPhones.forEach((line) => {
        if (line.deposit) {
          deposit += line.deposit.value * line.quantity;
        }
        if (line.fees) {
          fees += line.fees.value * line.quantity;
        }
      });
    }
    const transportCost =
      this.shippingMode === TELECOM_VOIP_ACTIVATION.shippingMode.mondialRelay ||
      !this.isShipping()
        ? 0
        : this.costs.voip.shipping.transporter.value;

    const total = deposit + fees + transportCost;
    this.phoneBill = {
      deposit,
      fees,
      transportCost,
      total,
    };
  }

  selectSipLineWithoutPhone() {
    if (this.orderCount.value === 1) {
      const line = this.modem.lines[0];
      line.needHardware = false;
      line.isShipping = false;
      this.isSipOnly = true;
      this.selectedPhones[0] = line;
      this.updatePhoneBill();
    }
    this.checkIfStillCanUncheckOrderablePhones();
  }
}
