angular
  .module('managerApp')
  .controller(
    'DeskaasConfirmTerminateCtrl',
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
          // eslint-disable-next-line no-param-reassign
          delete $location.$$search.action;
        }
        if ($location.$$search.token) {
          // eslint-disable-next-line no-param-reassign
          delete $location.$$search.token;
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
    },
  );
