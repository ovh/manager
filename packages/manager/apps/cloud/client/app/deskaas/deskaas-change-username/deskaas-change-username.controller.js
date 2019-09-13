

angular.module('managerApp')
  .controller('DeskaasChangeUsernameCtrl',
    function ($uibModalInstance) {
      const self = this;

      self.policies = {};

      self.values = {
        newUsername: '',
      };

      self.flags = {
        init: false,
      };

      self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      self.ok = function () {
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
