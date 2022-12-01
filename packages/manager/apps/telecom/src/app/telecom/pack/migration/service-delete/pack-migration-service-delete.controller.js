import chunk from 'lodash/chunk';
import set from 'lodash/set';

export default class TelecomPackMigrationServiceDeleteCtrl {
  /* @ngInject */
  constructor(TucPackMigrationProcess) {
    this.TucPackMigrationProcess = TucPackMigrationProcess;
  }

  $onInit() {
    this.process = null;

    this.process = this.TucPackMigrationProcess.getMigrationProcess();

    this.process.selectedOffer.subServicesToDelete = this.process.selectedOffer.subServicesToDelete.map(
      (subService) => ({
        ...subService,
        numberServices: subService.numberToDelete,
        services: subService.services.map((service) => ({
          name: service.service,
          isAllowed: service.isAllowed,
          renewPeriod: service.renewPeriod,
          renewPrice: service.renewPrice,
          price: service.price,
          selected: false,
        })),
      }),
    );

    this.chunkedSubServices = chunk(
      this.process.selectedOffer.subServicesToDelete,
      2,
    );
  }

  /*= ==============================
  =            HELPERS            =
  =============================== */
  static selectSubServices(modelValue, subService) {
    subService.services.forEach((service) => {
      if (service.isAllowed) {
        set(service, 'selected', modelValue);
      }
    });
  }

  static hasKeepableSubServices(subService) {
    return subService.services.some((service) => service.isAllowed);
  }

  /* -----  End of HELPERS  ------*/
}
