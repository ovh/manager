angular
  .module('managerApp')
  .controller(
    'DeskaasGetConsoleAccessCtrl',
    function DeskaasGetConsoleAccessCtrl($scope, $location, $uibModalInstance) {
      const self = this;

      self.cancel = function cancel() {
        // Remove popup
        $uibModalInstance.dismiss('cancel');
      };

      self.ok = function ok() {
        // Call POST /console to create the task, an email will be sent to the user
        $uibModalInstance.close(self.values);
      };
    },
  );
