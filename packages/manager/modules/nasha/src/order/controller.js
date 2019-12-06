export default class NashaOrderCompleteCtrl {
  /* @ngInject */
  constructor($stateParams) {
    const self = this;

    function init() {
      self.orderUrl = $stateParams.orderUrl;
    }

    init();
  }
}
