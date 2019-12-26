import keyBy from 'lodash/keyBy';

export default class CucSelectVrackCtrl {
  /* @ngInject */
  constructor($q, $window, $uibModalInstance, $stateParams, params) {
    this.$q = $q;
    this.projectId = $stateParams.projectId;
    this.orderUrl = params.orderUrl;
    this.modal = $uibModalInstance;
    this.$window = $window;
    // get vRacks for current user, shown in left side bar
    this.vRacks = params.vRacks;
    this.loaders = {
      activate: false,
    };
    // activate options ENUM
    this.activateOptions = keyBy(['EXISTING', 'NEW']);
    // selected activate option
    this.selectedActivateOption = this.activateOptions.EXISTING;
    // selected vRack
    this.selectedVrack = null;
  }

  /**
   * validates vRack selection field. Returns false if no value is selected.
   *
   * @param {any} value, selected index
   * @returns
   * @memberof AddVRackCtrl
   */
  static validateSelection(value) {
    return value && value !== '0';
  }

  /**
   * open order new vRack url in new window
   *
   * @memberof AddVRackCtrl
   */
  orderNewVrack() {
    return this.modal.close();
  }

  /**
   * close modal and return the chosen vrack
   *
   * @memberof AddVRackCtrl
   */
  selectVrack() {
    return this.modal.close({
      name: this.selectedVrack.displayName,
      serviceName: this.selectedVrack.serviceName,
    });
  }

  /**
   * action handler method called on click of active button on UI
   *
   * @memberof AddVRackCtrl
   */
  activate() {
    if (this.selectedActivateOption === this.activateOptions.EXISTING) {
      return this.selectVrack();
    }
    return this.orderNewVrack();
  }

  /**
   * action handler method called on click of cancel button on UI
   *
   * @memberof AddVRackCtrl
   */
  cancel() {
    this.modal.dismiss('cancel');
  }
}
