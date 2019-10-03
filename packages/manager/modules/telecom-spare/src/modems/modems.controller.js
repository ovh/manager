import map from 'lodash/map';

import modalDeleteController from './modal/delete/modems-modal-delete.controller';
import modalDeleteTemplate from './modal/delete/modems-modal-delete.html';
import modalReplaceController from './modal/replace/modems-modal-replace.controller';
import modalReplaceTemplate from './modal/replace/modems-modal-replace.html';
import modalReturnController from './modal/return/modems-modal-return.controller';
import modalReturnTemplate from './modal/return/modems-modal-return.html';

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
      template: modalReplaceTemplate,
      controller: modalReplaceController,
      controllerAs: '$ctrl',
      resolve: {
        params: () => {
          const params = {
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
   * Return the broken equipment in instantRefund
   */
  returnMerchandise({ spare }) {
    const modal = this.$uibModal.open({
      animation: true,
      template: modalReturnTemplate,
      controller: modalReturnController,
      controllerAs: '$ctrl',
      resolve: {
        params: () => {
          const params = {
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
   * Delete modem spare
   */
  delete({ spare }) {
    const modal = this.$uibModal.open({
      animation: true,
      template: modalDeleteTemplate,
      controller: modalDeleteController,
      controllerAs: '$ctrl',
      resolve: {
        params: () => {
          const params = {
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
