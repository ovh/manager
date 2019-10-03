import map from 'lodash/map';

import modalDeleteController from './modal/delete/phones-modal-delete.controller';
import modalDeleteTemplate from './modal/delete/phones-modal-delete.html';
import modalReplaceController from './modal/replace/phones-modal-replace.controller';
import modalReplaceTemplate from './modal/replace/phones-modal-replace.html';

export default class PhonesController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    $uibModal,
    OvhApiTelephony,
    TucToast,
    TucToastError,
  ) {
    this.$state = $state;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  loadRow({ spare }) {
    return this.OvhApiTelephony
      .Spare()
      .v6()
      .getSpare({ spare })
      .$promise;
  }


  orderNewPhone() {
    return this.$state.go('spare.phones.order');
  }

  refresh() {
    this.phones = null;

    // reset cache to force reload
    this.OvhApiTelephony.Spare().v6().resetAllCache();

    return this.OvhApiTelephony.Spare()
      .v6()
      .query()
      .$promise.then((phones) => {
        this.phones = map(phones, spare => ({ spare }));
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
      } else if (!result.spare) {
        const error = result.errorMessage;
        this.TucToast.error(this.$translate.instant(result.messageToDisplay, { error }));
      } else {
        const { spare } = result;
        this.TucToast.error(this.$translate.instant(result.messageToDisplay, { spare }));
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
      template: modalDeleteTemplate,
      controller: modalDeleteController,
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
}
