angular
  .module('managerApp')
  .controller('CdaUserDetailsCtrl', function CdaUserDetailsCtrl(
    $state,
    $stateParams,
  ) {
    const self = this;
    self.userName = '';
    self.loading = false;

    function init() {
      self.userName = $stateParams.userName;
    }

    init();
  });
