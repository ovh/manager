angular
  .module('managerApp')
  .controller('DeskaasChangeUsernameCtrl', function DeskaasChangeUsernameCtrl(
    $uibModalInstance,
  ) {
    const self = this;

    self.policies = {};

    self.values = {
      newUsername: '',
    };

    self.flags = {
      init: false,
    };

    self.cancel = function cancel() {
      $uibModalInstance.dismiss('cancel');
    };

    self.ok = function ok() {
      if (!self.values.newUsername) {
        $uibModalInstance.dismiss('cancel');
        return;
      }

      $uibModalInstance.close(self.values);
    };

    function init() {
      self.flags.init = false;
    }

    init();
  });
