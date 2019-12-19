import each from 'lodash/each';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

angular.module('managerApp').controller('TelecomTelephonyLinePhoneAccessoriesShippingCtrl', function TelecomTelephonyLinePhoneAccessoriesShippingCtrl($q, TucTelephonyAccessoriesOrderProcess) {
  const self = this;

  self.process = null;
  self.loading = {
    init: false,
  };
  self.shippingOptions = {
    forceContactSelect: true,
    payForRelay: true,
  };
  self.contactChoiceOptions = null;
  self.contactDeferred = $q.defer();

  /*= ==============================
    =            HELPERS            =
    =============================== */

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
        (groups) => groups[0],
      ),
      (contact) => get(contact, 'address') && ['BE', 'FR', 'CH'].indexOf(contact.address.country) > -1,
    );
  }

  function getTotalAccessoriesQuantity() {
    let totalQty = 0;
    angular.forEach(self.process.accessoriesList, (accessory) => {
      totalQty += accessory.quantity;
    });
    return totalQty;
  }

  function initComponentsOptions() {
    let shippingPrice = 0;

    // shipping mode selection options
    self.shippingOptions.disableMondialRelay = getTotalAccessoriesQuantity() > 1;

    // contact options
    self.contactDeferred.promise
      .then(() => TucTelephonyAccessoriesOrderProcess.getOrderCheckout()
        .then((order) => {
          each(
            filter(
              order.details,
              {
                detailType: 'DELIVERY',
              },
            ),
            (detail) => {
              shippingPrice += detail.totalPrice.value;
            },
          );

          self.shippingOptions.shippingPrice = shippingPrice;
        })
        .finally(() => {
          self.loading.init = false;
        }));
    self.contactChoiceOptions = {
      filter: filterContact,
    };
  }

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.onShippingModeInitialized = function onShippingModeInitialized() {
    self.loading.init = false;
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;
    self.process = TucTelephonyAccessoriesOrderProcess.getOrderProcess();
    initComponentsOptions();
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
