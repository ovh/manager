import { CONTEXT } from '../pack-move.constant';

export default class MoveOntShippingCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhContact,
    MoveOntShippingService,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhContact = OvhContact;
    this.MoveOntShippingService = MoveOntShippingService;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.ovhContactOptions = {
      options: {
        allowCreation: true,
        allowEdition: false,
      },
    };
    this.loading = {
      init: true,
    };
    this.ontShipping = {
      address: null,
    };

    return this.MoveOntShippingService.getAddress(
      this.packName,
      CONTEXT.voipLine,
    )
      .then(({ data }) => {
        this.ovhContactOptions.customList = data.map(
          ({
            address,
            cityName,
            countryCode,
            zipCode,
            firstName,
            lastName,
            shippingId,
          }) =>
            new this.OvhContact({
              address: {
                line1: address,
                city: cityName,
                country: countryCode,
                zip: zipCode,
              },
              firstName,
              lastName,
              id: shippingId,
            }),
        );

        this.ontShipping.address = this.ovhContactOptions.customList.at(0);
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('pack_move_ont_shipping_addresses_error', {
            error: error.data?.message,
          }),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  next() {
    this.$scope.$emit('ontShippingSelected', this.ontShipping);
  }
}
