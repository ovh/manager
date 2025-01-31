export default class ConfirmRequestErasureController {
  /* @ngInject */
  constructor($stateParams) {
    this.$stateParams = $stateParams;
  }

  $onInit() {
    this.publicId = this.$stateParams.publicId;
  }
}
