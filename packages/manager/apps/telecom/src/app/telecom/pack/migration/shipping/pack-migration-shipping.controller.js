import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';

export default class TelecomPackMigrationShippingCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    TucPackMigrationProcess,
    OvhContact,
    OvhApiPackXdsl,
    TucToast,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.OvhContact = OvhContact;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.process = null;
    this.ovhContactOptions = {
      options: {
        allowCreation: false,
        allowEdition: false,
      },
    };
    this.loading = {
      init: false,
    };
    this.model = {
      shippingMode: null,
      selectedRelay: null,
    };

    this.loading.init = true;

    this.process = this.TucPackMigrationProcess.getMigrationProcess();

    return this.OvhApiPackXdsl.v6()
      .shippingAddresses({
        packName: this.process.pack.packName,
        context: 'migration',
      })
      .$promise.then((shippingAddresses) => {
        this.ovhContactOptions.customList = map(
          shippingAddresses,
          (shippingAddress) =>
            new this.OvhContact({
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

        this.process.shipping.address = head(this.ovhContactOptions.customList);
      })
      .catch((error) => {
        const msgErr = `${this.$translate(
          'telecom_pack_migration_shipping_addresses_error',
        )} ${get(error, 'data.message', '')}`;
        this.TucToast.error(msgErr);
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  cancelMigration() {
    this.TucPackMigrationProcess.cancelMigration();
  }
}
