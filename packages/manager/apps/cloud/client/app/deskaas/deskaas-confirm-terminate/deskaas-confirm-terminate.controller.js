angular.module('managerApp')
  .controller('DeskaasConfirmTerminateCtrl',
    function DeskaasConfirmTerminateCtrl(
      $scope,
      $location,
      $uibModalInstance,
      token,
    ) {
      const self = this;

      self.values = {
        token,
        reason: '',
        commentary: '',
      };

      self.flags = {
        init: false,
      };

      function removeConfirmationParams() {
        if ($location.$$search.action) {
          delete $location.$$search.action; // eslint-disable-line
        }
        if ($location.$$search.token) {
          delete $location.$$search.token; // eslint-disable-line
        }
        // Do not reload url
        $location.$$compose();
      }

      self.cancel = function cancel() {
        // clear params needed to display confirmation
        removeConfirmationParams();
        // Remove popup
        $uibModalInstance.dismiss('cancel');
      };

      self.ok = function ok() {
        // clear params needed to display confirmation
        removeConfirmationParams();
        if (!self.values.token && !self.values.reason) {
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
