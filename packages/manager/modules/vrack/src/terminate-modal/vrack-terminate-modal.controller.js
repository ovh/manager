import { TERMINATE_VALUE } from './vrack-terminate-modal.constants';
import {
  VRACK_TRACKING_PREFIX,
  VRACK_TRACKING_CONTEXT,
} from '../vrack.constant';

export default class VrackTerminateModalCtrl {
  /* @ngInject */
  constructor($scope, atInternet, $stateParams) {
    this.$scope = $scope;
    this.atInternet = atInternet;
    this.$stateParams = $stateParams;
  }

  $onInit() {
    this.terminateField = null;
    this.terminateValue = TERMINATE_VALUE;
    this.isTerminateFieldValid = false;
    this.$scope.$watch('$ctrl.isOpenModal', (toOpen) => {
      if (toOpen) {
        this.atInternet.trackPage({
          name: `${VRACK_TRACKING_PREFIX}vrack-private-network::pop-up::delete::vrack-private-network`,
          ...VRACK_TRACKING_CONTEXT,
          page_category: 'detail',
        });
      }
    });
  }

  cancel() {
    this.trackAction('cancel');
    this.onCancel();
  }

  terminate() {
    this.trackAction('delete');
    this.onConfirm();
  }

  trackAction(action) {
    this.atInternet.trackClick({
      name: `${VRACK_TRACKING_PREFIX}pop-up::button::${action}_vrack-private-networks`,
      type: 'action',
      ...VRACK_TRACKING_CONTEXT,
    });
  }

  validateField() {
    this.isTerminateFieldValid = this.terminateField === TERMINATE_VALUE;
  }
}
