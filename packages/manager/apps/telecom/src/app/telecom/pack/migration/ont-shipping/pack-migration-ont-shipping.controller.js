import { PROCESS_STEP, CONTEXT } from '../pack-migration.constant';

export default class PackMigrationOntShippingCtrl {
  /* @ngInject */
  constructor(
    $translate,
    TucPackMigrationProcess,
    OvhContact,
    PackMigrationOntShippingService,
    TucToast,
  ) {
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.OvhContact = OvhContact;
    this.PackMigrationOntShippingService = PackMigrationOntShippingService;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.process = null;
    this.ovhContactOptions = {
      options: {
        allowCreation: true,
        allowEdition: false,
      },
    };
    this.loading = {
      init: true,
    };

    this.process = this.TucPackMigrationProcess.getMigrationProcess();

    this.process.ontShipping = {
      address: null,
    };

    // Initialize ONT address shipping
    return this.PackMigrationOntShippingService.getShippingAddresses(
      this.process.pack.packName,
      CONTEXT.voipline,
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
        this.process.ontShipping.address = this.ovhContactOptions.customList.at(
          0,
        );
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant(
            'telecom_pack_migration_ont_shipping_addresses_error',
            { error: error.data?.message },
          ),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* =============================
     =        ACTIONS            =
     ============================= */
  nextStep() {
    this.process.currentStep = PROCESS_STEP.confirm;
    if (this.process.selectedOffer.needNewModem) {
      this.process.currentStep = PROCESS_STEP.shipping;
    } else if (this.process.selectedOffer.needMeeting) {
      this.process.currentStep = PROCESS_STEP.meeting;
    }
  }
}
