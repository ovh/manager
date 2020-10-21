import get from 'lodash/get';
import head from 'lodash/head';

export default class TelecomPackMigrationCtrl {
  /* @ngInject */
  constructor($translate, TucPackMigrationProcess, TucToast) {
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading = {
      init: false,
    };
    this.process = null;

    this.loading.init = true;
    this.process = this.TucPackMigrationProcess.init(this.packName);

    return this.TucPackMigrationProcess.checkForPendingMigration()
      .then((pendingTasks) => {
        if (pendingTasks && pendingTasks.length === 1) {
          this.process.currentStep = 'migration';
          this.process.migrationTaskId = head(pendingTasks);
          this.process.migrationDoing = true;
        } else {
          this.process.currentStep = 'offers';
        }
      })
      .catch((error) => {
        const msgErr = `${this.$translate.instant(
          'telecom_pack_migration_offer_choice_error_loading',
        )} ${get(error, 'data.message', '')}`;
        this.TucToast.error(msgErr);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }
}
