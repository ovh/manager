import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';

export default class MoveShippingCtrl {
  /* @ngInject */
  constructor($scope, $translate, OvhContact, OvhApiPackXdsl, TucToast) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhContact = OvhContact;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.TucToast = TucToast;
  }

  $onInit() {
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
    this.shipping = {
      address: null,
      mode: null,
      relay: null,
    };

    this.loading.init = true;

    return this.OvhApiPackXdsl.v6()
      .shippingAddresses({
        packName: this.packName,
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

        this.shipping.address = head(this.ovhContactOptions.customList);
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'pack_move_shipping_addresses_error',
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  next() {
    this.$scope.$emit('shippingSelected', this.shipping);
  }
}
