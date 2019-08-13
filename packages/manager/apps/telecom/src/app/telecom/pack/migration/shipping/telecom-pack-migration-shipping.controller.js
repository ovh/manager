angular.module('managerApp').controller('TelecomPackMigrationShippingCtrl', function ($q, $translate, TucPackMigrationProcess, OvhContact, OvhApiPackXdsl, TucToast) {
  const self = this;

  self.process = null;
  self.ovhContactOptions = {
    options: {
      allowCreation: false,
      allowEdition: false,
    },
  };
  self.loading = {
    init: false,
  };
  self.model = {
    shippingMode: null,
    selectedRelay: null,
  };

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.cancelMigration = function () {
    TucPackMigrationProcess.cancelMigration();
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.loading.init = true;

    self.process = TucPackMigrationProcess.getMigrationProcess();

    return OvhApiPackXdsl.v6().shippingAddresses({
      packName: self.process.pack.packName,
      context: 'migration',
    }).$promise.then((shippingAddresses) => {
      self.ovhContactOptions.customList = _.map(
        shippingAddresses,
        shippingAddress => new OvhContact({
          address: {
            line1: shippingAddress.address,
            city: shippingAddress.cityName,
            country: shippingAddress.countryCode,
            zip: shippingAddress.zipCode,
          },
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          id: shippingAddress.shippingId,
        }),
      );

      self.process.shipping.address = _.first(self.ovhContactOptions.customList);
    }, (error) => {
      TucToast.error([$translate.instant('telecom_pack_migration_shipping_addresses_error'), _.get(error, 'data.message', '')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
