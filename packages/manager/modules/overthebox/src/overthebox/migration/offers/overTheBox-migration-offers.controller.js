import { ABOUT_OTB_SERVICE } from '../overTheBox-migration.constant';

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

    this.ABOUT_OTB_SERVICE = ABOUT_OTB_SERVICE;
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
          const updateOffer = offer;

          const hardwareOptions = offer.hardwares.map((hardware) => {
            // Set hardware option return by API
            const optionLabel = this.$translate.instant(
              'overthebox_migration_hardware_yes',
              {
                deviceName: hardware.hardwareDisplayName,
                price: hardware.hardwarePrice
                  ? hardware.hardwarePrice.text
                  : '',
              },
            );
            return {
              name: hardware.hardwareName,
              price: hardware.hardwarePrice,
              deviceName: hardware.hardwareDisplayName,
              label: optionLabel,
            };
          });

          // Set no hardware option choice
          const optionLabel = this.$translate.instant(
            'overthebox_migration_hardware_no',
          );
          const option = {
            name: 'no',
            price: null,
            label: optionLabel,
          };
          hardwareOptions.push(option);

          updateOffer.hardwareOptions = hardwareOptions;
          updateOffer.selectedHardwareName = hardwareOptions[0].name;
          return updateOffer;
        });
      })
      .catch((error) => {
        // Display error message
        const msg = error?.data?.message;
        this.TucToast.error(
          this.$translate.instant('overthebox_migration_offers_error', {
            errorMsg: msg,
          }),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  selectOffer(offer) {
    const updateOffer = offer;
    updateOffer.currentOffer = this.currentOffer;
    updateOffer.offerQuantity = 1;
    if (offer.selectedHardwareName) {
      updateOffer.selectedHardwareQuantity = 1;

      // Retrieve price for selected hardware
      const selectedHardware = offer.hardwares.filter(
        (hardware) => hardware.hardwareName === offer.selectedHardwareName,
      )[0];
      updateOffer.selectedHardware = selectedHardware;
    }

    this.$scope.$emit('selectedOffer', updateOffer);
  }
}
