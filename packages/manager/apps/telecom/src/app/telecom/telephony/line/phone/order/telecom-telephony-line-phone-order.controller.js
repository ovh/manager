import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';
import upperFirst from 'lodash/upperFirst';

angular.module('managerApp').controller('TelecomTelephonyLinePhoneOrderCtrl', function TelecomTelephonyLinePhoneOrderCtrl($q, $scope, $stateParams, $translate, TucIpAddress, TelephonyMediator, OvhApiTelephony, OvhApiOrder, TucToast, TucToastError, TELEPHONY_RMA) {
  const self = this;

  self.pdfBaseUrl = TELEPHONY_RMA.pdfBaseUrl;
  self.rmaStatusUrl = TelephonyMediator.getV6ToV4RedirectionUrl('line.line_sav_rma_status');

  function fetchOfferPhones(offer) {
    return OvhApiTelephony.v6().getLineOfferPhones({
      country: 'fr',
      offer,
    }).$promise;
  }

  function fetchMerchandiseAvailable() {
    return OvhApiTelephony.Line().Phone().v6().getMerchandiseAvailable({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise.then((result) => {
      forEach(result, (phone) => {
        const parts = (phone.name || '').split(/\./);
        set(phone, 'displayName', `${upperFirst(head(parts))} ${parts.slice(1).map((p) => (p || '').toUpperCase()).join(' ')}`);
      });
      return filter(result, (phone) => phone.price && phone.price.value >= 0);
    }).then((result) => fetchOfferPhones(self.line.getPublicOffer.name).then((offers) => {
      forEach(offers, (offer) => {
        const found = find(result, { name: offer.brand });
        if (found) {
          found.displayName = offer.description;
        }
      });
      return result;
    }));
  }

  function fetchOrder(order) {
    const params = {
      serviceName: $stateParams.serviceName,
      hardware: order.phone,
      retractation: order.retract,
      shippingContactId: order.contact.id,
    };
    if (get(order, 'shipping.mode') === 'mondialRelay') {
      params.mondialRelayId = order.shipping.relay.id;
    }
    self.isFetchingOrder = true;
    return OvhApiOrder.Telephony().v6().getHardware(params).$promise.finally(() => {
      self.isFetchingOrder = false;
    });
  }

  function filterContact(contacts) {
    return filter(
      map(
        groupBy(
          contacts,
          (contact) => {
            // group contact to detect contact that are the same
            const contactCopy = {
              lastName: contact.lastName,
              firstName: contact.firstName,
            };
            if (contact.address) {
              contactCopy.address = {
                country: contact.address.country,
                line1: contact.address.line1,
                zip: contact.address.zip,
                city: contact.address.city,
              };
            }
            return JSON.stringify(contactCopy);
          },
        ),
        (groups) => head(groups),
      ),
      (contact) => get(contact, 'address') && ['BE', 'FR', 'CH'].indexOf(contact.address.country) > -1,
    );
  }

  function init() {
    self.orderStep = 'hardware';

    self.order = {
      contact: null,
      phone: null,
      summary: null,
      rmas: [],
      shipping: {
        mode: null,
        relay: null,
        options: {
          shippingPrice: 0,
        },
      },
      retract: true,
      isContractsAccepted: false,
      url: null,
      success: false,
      orderURL: null,
    };

    self.contactChoiceOptions = {
      filter: filterContact,
    };

    self.macAddress = null;
    self.line = null;
    self.phone = null;
    self.phoneOffers = null;
    self.billingAccount = $stateParams.billingAccount;
    self.serviceName = $stateParams.serviceName;
    self.hasPendingOfferTasks = false;

    self.isLoading = true;
    TelephonyMediator.getGroup($stateParams.billingAccount).then((group) => {
      self.line = group.getLine($stateParams.serviceName);
    }).then(() => OvhApiTelephony.Line().v6().get({
      billingAccount: self.line.billingAccount,
      serviceName: self.line.serviceName,
    }).$promise.then((result) => {
      assign(
        self.line,
        { getPublicOffer: result.getPublicOffer },
        { isAttachedToOtherLinesPhone: result.isAttachedToOtherLinesPhone },
      );
    })).then(() => self.line.hasPendingOfferTasks())
      .then((hasPendingOfferTasks) => {
        self.hasPendingOfferTasks = hasPendingOfferTasks;
        return self.line.getPhone();
      })
      .then((phone) => {
        self.phone = phone;
        if (phone) {
          return phone.getRMAs().then((rmas) => {
            self.rmas = rmas;
          }).then(() => {
            self.isStepLoading = true;
            fetchMerchandiseAvailable().then((result) => {
              self.merchandise = result;
            }).catch((err) => new TucToastError(err)).finally(() => {
              self.isStepLoading = false;
            });
          });
        }
        self.rmas = [];
        return fetchOfferPhones(self.line.getPublicOffer.name).then((offers) => {
          self.phoneOffers = offers;
          if (offers.length) {
            self.order.phone = head(offers).brand;
          }
        });
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });

    $scope.$watch('PhoneOrderCtrl.orderStep', (step) => {
      switch (step) {
        case 'hardware':
          if (self.phone) {
            self.isStepLoading = true;
            fetchMerchandiseAvailable().then((result) => {
              self.merchandise = result;
            }).catch((err) => new TucToastError(err)).finally(() => {
              self.isStepLoading = false;
            });
          } else if (self.line && self.line.getPublicOffer) {
            fetchOfferPhones(self.line.getPublicOffer.name).then((offers) => {
              self.phoneOffers = offers;
            }).catch((err) => new TucToastError(err)).finally(() => {
              self.isStepLoading = false;
            });
          }
          break;
        case 'summary':
          self.isStepLoading = true;
          self.order.isContractsAccepted = false;
          fetchOrder(self.order).then((result) => {
            self.order.summary = result;
          }).catch((err) => new TucToastError(err)).finally(() => {
            self.isStepLoading = false;
          });
          break;
        default:
          break;
      }
    });
  }

  self.submitPhoneReturn = function submitPhoneReturn() {
    self.isSubmiting = true;
    return OvhApiTelephony.Line().Phone().RMA().v6()
      .post({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }, {
        type: 'restitution but keep the service enable', // nice enum ...
      }).$promise.then(() => self.phone.getRMAs()).then((rmas) => {
        self.rmas = rmas;
        self.returnSuccess = true;
        self.orderStep = 'hardware'; // reset form
      }).catch((err) => new TucToastError(err)).finally(() => {
        self.isSubmiting = false;
      });
  };

  self.submitOrder = function submitOrder() {
    if (self.phone) {
      return self.submitRma();
    }
    const params = {
      hardware: self.order.phone,
      retractation: self.order.retract,
    };
    if (get(self.order, 'shipping.mode') === 'mondialRelay') {
      params.mondialRelayId = self.order.shipping.relay.id;
    } else {
      params.shippingContactId = self.order.contact.id;
    }
    self.isSubmiting = true;
    return OvhApiOrder.Telephony().v6().orderHardware({
      serviceName: $stateParams.serviceName,
    }, params).$promise.then((order) => {
      self.order.success = true;
      self.order.orderURL = order.url;
      self.orderStep = 'hardware'; // reset form
    }).catch((err) => new TucToastError(err)).finally(() => {
      self.isSubmiting = false;
    });
  };

  self.submitRma = function submitRma() {
    const params = {
      newMerchandise: self.order.phone,
      type: 'change to another phone/equipment (restitution first and shipping then)', // nice enum ...
    };

    if (get(self.order, 'shipping.mode') === 'mondialRelay') {
      params.mondialRelayId = self.order.shipping.relay.id;
    } else {
      params.shippingContactId = self.order.contact.id;
    }

    self.isSubmiting = true;
    return OvhApiTelephony.Line().Phone().RMA().v6()
      .post({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }, params).$promise.then(() => self.phone.getRMAs()).then((rmas) => {
        self.rmas = rmas;
        self.order.success = true;
        self.orderStep = 'hardware'; // reset form
      }).catch((err) => new TucToastError(err)).finally(() => {
        self.isSubmiting = false;
      });
  };

  self.getPhoneLabel = function getPhoneLabel(phone) {
    const name = $translate.instant('telephony_line_phone_order_order_change_for', { phone: phone.displayName });
    const price = $translate.instant('telephony_line_phone_order_order_price_tax_free', { price: phone.price.text });
    return [name, price].join(' ');
  };

  self.getOfferLabel = function getOfferLabel(offer) {
    const name = $translate.instant('telephony_line_phone_order_order_a', { brand: offer.description });
    const price = $translate.instant('telephony_line_phone_order_order_price2_tax_free', { price: offer.price.text });
    return [name, price].join(' ');
  };

  self.isSamePhone = function isSamePhone() {
    return self.phone && self.order.phone && (`phone.${self.order.phone}`) === self.phone.brand;
  };

  self.ipValidator = (function ipValidator() {
    return {
      test(value) {
        return TucIpAddress.isValidPublicIp4(value);
      },
    };
  }());

  self.detachPhone = function detachPhone() {
    self.isDetaching = true;
    OvhApiTelephony.Line().v6().dissociateDevice({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, {
      ipAddress: self.attachedPhoneIpAddress,
      macAddress: self.phone.macAddress,
    }).$promise.then(() => {
      TucToast.success($translate.instant('telephony_line_phone_order_detach_device_success'));

      // Cache reset
      OvhApiTelephony.Line().v6().resetAllCache();
      OvhApiTelephony.Line().Phone().v6().resetAllCache();
      TelephonyMediator.resetAllCache();
      init();
    }).catch((err) => {
      TucToast.error([$translate.instant('telephony_line_phone_order_detach_device_error'), get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.isDetaching = false;
    });
  };

  init();
});
