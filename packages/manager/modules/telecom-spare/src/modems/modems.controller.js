import map from 'lodash/map';

import modalController from './modal/modems-modal.controller';
import modalTemplate from './modal/modems-modal.html';

export default class ModemsController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    $uibModal,
    OvhApiXdsl,
    TucToast,
    TucToastError,
  ) {
    this.$state = $state;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  loadRow({ spare }) {
    return this.OvhApiXdsl
      .Spare()
      .v6()
      .getSpare({ spare })
      .$promise;
  }

  orderNewModem() {
    return this.$state.go('spare.modems.order');
  }

  refresh() {
    this.modems = null;

    // reset cache to force reload
    this.OvhApiXdsl.Spare().v6().resetAllCache();

    return this.OvhApiXdsl.Spare()
      .v6()
      .query()
      .$promise.then((modems) => {
        this.modems = map(modems, spare => ({ spare }));
      });
  }

  /**
   * Replace modem by its spare
   */
  replace({ spare }) {
    const modal = this.$uibModal.open({
      animation: true,
      template: modalTemplate,
      controller: modalController,
      controllerAs: '$ctrl',
      resolve: {
        params: () => {
          const params = {
            action: 'replacement',
            spare,
          };
          return params;
        },
      },
    });
    modal.result
      .then(data => this.displayActionResult(data.actionResult))
      .catch(() => this.displayActionResult(null));
  }

  /**
   * Display success or error message in toast message
   */
  displayActionResult(result) {
    if (result) {
      if (result.isSucceed) {
        this.TucToast.success(this.$translate.instant(result.messageToDisplay));
      } else {
        const error = result.errorMessage;
        this.TucToast.error(this.$translate.instant(result.messageToDisplay, { error }));
      }
      this.refresh();
    }
  }

  /**
   * Delete the spare as if it was not belonging to OVH anymore
   */
  delete({ spare }) {
    const modal = this.$uibModal.open({
      animation: true,
      template: modalTemplate,
      controller: modalController,
      controllerAs: '$ctrl',
      resolve: {
        params: () => {
          const params = {
            action: 'delete',
            spare,
          };
          return params;
        },
      },
    });
    modal.result
      .then(data => this.displayActionResult(data.actionResult))
      .catch(() => this.displayActionResult(null));
  }

  /**
   * Return the broken equipment in instantRefund
   */
  returnMerchandise({ spare }) {
    const modal = this.$uibModal.open({
      animation: true,
      template: modalTemplate,
      controller: modalController,
      controllerAs: '$ctrl',
      resolve: {
        params: () => {
          const params = {
            action: 'return',
            spare,
          };
          return params;
        },
      },
    });
    modal.result
      .then(data => this.displayActionResult(data.actionResult))
      .catch(() => this.displayActionResult(null));
  }
}
