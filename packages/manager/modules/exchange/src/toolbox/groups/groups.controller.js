import angular from 'angular';

export default /* @ngInject */ function ($scope) {
  $scope.updateDisclaimer = function updateDisclaimer(disclaimer) {
    if (!disclaimer.taskPendingId) {
      $scope.setAction(
        'exchange/disclaimer/update/disclaimer-update',
        angular.copy(disclaimer),
      );
    }
  };

  $scope.deleteDisclaimer = function deleteDisclaimer(disclaimer) {
    if (!disclaimer.taskPendingId) {
      $scope.setAction(
        'exchange/disclaimer/remove/disclaimer-remove',
        angular.copy(disclaimer),
      );
    }
  };
}
