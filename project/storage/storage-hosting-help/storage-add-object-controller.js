angular.module('managerApp').controller('RA.storage.dnsHelp', ['$scope', '$uibModalInstance',
  function ($scope, $uibModalInstance) {
    $scope.confirm = function () {
      $uibModalInstance.dismiss();
    };
  },
]);
