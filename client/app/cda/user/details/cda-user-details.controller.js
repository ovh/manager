angular.module('managerApp')
  .controller('CdaUserDetailsCtrl', function ($state, $stateParams) {
    const self = this;
    self.userName = '';
    self.loading = false;

    function init() {
      self.userName = $stateParams.userName;
    }

    init();
  });
