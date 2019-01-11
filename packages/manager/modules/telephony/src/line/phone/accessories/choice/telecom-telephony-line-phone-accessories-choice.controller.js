angular.module('managerApp').controller('TelecomTelephonyLinePhoneAccessoriesChoiceCtrl', function ($q, $translate, TucTelephonyAccessoriesOrderProcess) {
  const self = this;

  self.process = null;
  self.orderTotal = null;

  self.loading = {
    init: false,
  };
  self.error = {
    loading: null,
  };
  self.spinnerExtremities = {
    min: 0,
    max: 100,
  };

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.hasAtLeastOneAccessory = function () {
    return !!_.find(self.process.accessoriesList, accessory => accessory.quantity > 0);
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.updateOrderTotal = function () {
    let total = 0;
    angular.forEach(self.process.accessoriesList, (accessory) => {
      total += accessory.price.value * accessory.quantity;
    });

    self.orderTotal = TucTelephonyAccessoriesOrderProcess.getPriceStruct(total);
    return self.orderTotal;
  };

  self.validateStep = function () {
    self.process.currentView = 'shipping';
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TucTelephonyAccessoriesOrderProcess.getAvailableAccessories().then((orderProcess) => {
      self.process = orderProcess;
      self.chunkedList = _.chunk(self.process.accessoriesList, 4);
      self.orderTotal = TucTelephonyAccessoriesOrderProcess.getPriceStruct(0);
    }, (error) => {
      self.error.loading = error;
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
