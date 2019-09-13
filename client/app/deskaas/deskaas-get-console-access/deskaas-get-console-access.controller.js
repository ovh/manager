

angular.module('managerApp')
  .controller('DeskaasGetConsoleAccessCtrl',
    function ($scope, $location, $uibModalInstance) {
      const self = this;

      self.cancel = function () {
        // Remove popup
        $uibModalInstance.dismiss('cancel');
      };

      self.ok = function () {
        // Call POST /console to create the task, an email will be sent to the user
        $uibModalInstance.close(self.values);
      };
    });
