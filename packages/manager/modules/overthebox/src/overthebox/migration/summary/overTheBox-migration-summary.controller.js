import {
  NO_HARDWARE,
  HELP_BILLING_URL,
} from '../overTheBox-migration.constant';

export default class OverTheBoxMigrationContactCtrl {
  /* @ngInject */
  constructor($scope, $translate, OverTheBoxMigrationSummaryService, TucToast) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OverTheBoxMigrationSummaryService = OverTheBoxMigrationSummaryService;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.loading = true;
    this.NO_HARDWARE = NO_HARDWARE;
    this.HELP_BILLING_URL = HELP_BILLING_URL;

    if (this.offer.selectedHardwareName !== NO_HARDWARE) {
      this.hardwarePrice = {
        value: '0',
        currencyCode: this.offer.selectedHardware.hardwarePrice.currencyCode,
        text: `0.00 ${this.offer.selectedHardware.hardwarePrice.text.slice(
          -1,
        )}`,
      };
    }

    this.getFirstMonthPrice();

    this.getOfferTargetDetail();
  }

  getFirstMonthPrice() {
    if (this.offer.selectedHardwareName !== NO_HARDWARE) {
      const value =
        parseFloat(this.offer.price.value) +
        parseFloat(this.offer.selectedHardware.hardwarePrice.value);
      this.firstMensuality = {
        value,
        currencyCode: this.offer.price.currencyCode,
        text: `${parseFloat(value).toFixed(2)} ${this.offer.price.text.slice(
          -1,
        )}`,
      };
    }
  }

  getOfferTargetDetail() {
    const isSelectedHardware = this.offer.selectedHardwareName !== NO_HARDWARE;
    return this.OverTheBoxMigrationSummaryService.getOfferTargetDetail(
      this.serviceName,
      this.offer.offer,
      isSelectedHardware,
      this.contact?.address.id,
    )
      .then(({ data }) => {
        this.contracts = data.contracts;
      })
      .catch((error) => {
        // Display error message
        const msg = error?.data?.message;
        this.TucToast.error(
          this.$translate.instant(
            'overthebox_migration_summary_get_offer_detail_error',
            {
              errorMsg: msg,
            },
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  launchMigration() {
    this.loading = true;
    const selectedHardwareName =
      this.offer.selectedHardwareName !== NO_HARDWARE
        ? this.offer.selectedHardwareName
        : '';
    return this.OverTheBoxMigrationSummaryService.migrateOffer(
      this.serviceName,
      this.offer.offer,
      selectedHardwareName,
      this.contact?.address.id,
    )
      .then(({ data }) => {
        this.isMigrationOK = true;
        this.commandOrder = data;
      })
      .catch((error) => {
        // Display error message
        const msg = error?.data?.message;
        this.TucToast.error(
          this.$translate.instant(
            'overthebox_migration_summary_launch_migration_error',
            {
              errorMsg: msg,
            },
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
