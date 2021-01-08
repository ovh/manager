export default class CdaUserDetailsCtrl {
  /* @ngInject */
  constructor($state, $stateParams) {
    const self = this;
    self.userName = '';
    self.loading = false;

    function init() {
      self.userName = $stateParams.userName;
    }

    init();
  }
}
