<<<<<<< HEAD
=======
import set from 'lodash/set';

>>>>>>> 1da911c016 (feat(overthebox): add change offer component - offer list)
export default class OverTheBoxMigrationOffersCtrl {
  /* @ngInject */
  constructor($q, $scope, $translate, TucToast, OverTheBoxMigrationService) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.OverTheBoxMigrationService = OverTheBoxMigrationService;
  }

  $onInit() {
    this.offers = [];
    this.loading = true;

    this.$q.all([this.getCurrentOffer(), this.getOffers()]).finally(() => {
      this.loading = false;
    });
  }

  getCurrentOffer() {
    return this.OverTheBoxMigrationService.getOfferDetail(
      this.serviceName,
    ).then((otb) => {
      this.currentOffer = {
        prettyOfferName: otb.prettyOfferName,
        offer: otb.offer,
      };
      return otb;
    });
  }

  getOffers() {
    return this.OverTheBoxMigrationService.getOffers(this.serviceName)
      .then(({ data }) => {
        this.offers = data;
        if (this.offers.length > 0) {
          // Retrieve current offer price
          this.currentOffer.currentOfferPrice = this.offers[0].currentOfferPrice;
        }

        // Build hardware options list
        this.offers = this.offers.map((offer) => {
<<<<<<< HEAD
          const updateOffer = offer;
=======
>>>>>>> 1da911c016 (feat(overthebox): add change offer component - offer list)
          const hardwareOptions = [];

          // Set hardware option return by API
          let optionLabel = this.$translate.instant(
            'overthebox_migration_hardware_yes',
            { price: offer.hardwarePrice ? offer.hardwarePrice.text : '' },
          );
          let option = {
            name: offer.hardwareName,
            price: offer.hardwarePrice,
            label: optionLabel,
          };
          hardwareOptions.push(option);

          // Set no hardware option choice
          optionLabel = this.$translate.instant(
            'overthebox_migration_hardware_no',
          );
          option = {
            name: 'no',
            price: null,
            label: optionLabel,
          };
          hardwareOptions.push(option);

          updateOffer.hardwareOptions = hardwareOptions;
          updateOffer.selectedHardware = hardwareOptions[0].name;
          return updateOffer;
        });
      })
      .catch((error) => {
        // Display error message
        const msg = error?.data?.message;
        this.TucToast.error(
          this.$translate.instant('overthebox_migration_offers_error', {
            error: msg,
          }),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  selectOffer(offer) {
    this.$scope.$emit('selectedOffer', offer);
  }
}
