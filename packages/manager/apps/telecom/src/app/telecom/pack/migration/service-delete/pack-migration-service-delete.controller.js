import chunk from 'lodash/chunk';
import set from 'lodash/set';

import { PROCESS_STEP } from '../pack-migration.constant';

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

  next() {
    this.process.currentStep = PROCESS_STEP.confirm;
    if (this.process.selectedOffer.customOntAddress) {
      this.process.currentStep = PROCESS_STEP.ontShipping;
    } else if (this.process.selectedOffer.needNewModem) {
      this.process.currentStep = PROCESS_STEP.shipping;
    } else if (this.process.selectedOffer.needMeeting) {
      this.process.currentStep = PROCESS_STEP.meeting;
    }
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
