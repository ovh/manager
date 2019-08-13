angular.module('managerApp').controller('PackxdslaccesslinediagnosticCtrl', function ($state, $stateParams, OvhApiMeVipStatus) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.isVIP = false;
  self.diagnosticType = $stateParams.type || 'noSync';

  function init() {
    self.loading.init = true;

    // if error in API call, you are not VIP by default
    return OvhApiMeVipStatus.v6().get().$promise.then(() => {
      // self.isVIP = data.telecom;
      self.isVIP = true;
      if (!self.isVIP) {
        $state.go('pack-xdsl.access.diagnostic');
        return;
      }

      // for line diag
      self.lineNumber = $stateParams.number;
      self.serviceName = $stateParams.serviceName;
    }, () => {
      $state.go('pack-xdsl.access.diagnostic');
    }).finally(() => {
      self.loading.init = false;
    });
  }

  init();
});
