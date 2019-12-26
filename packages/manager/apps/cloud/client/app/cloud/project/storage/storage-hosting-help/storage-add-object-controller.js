angular.module('managerApp').controller('RA.storage.dnsHelp', [
  '$scope',
  '$uibModalInstance',
  function RAStorageDnsHelpCtrl($scope, $uibModalInstance) {
    $scope.confirm = function confirm() {
      $uibModalInstance.dismiss();
    };
  },
]);
