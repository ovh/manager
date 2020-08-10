import angular from 'angular';

export default /* @ngInject */ function($scope) {
  $scope.updateDisclaimer = function updateDisclaimer(disclaimer) {
    if (!disclaimer.taskPendingId) {
      $scope.setAction(
        'emailpro/disclaimer/update/emailpro-disclaimer-update',
        angular.copy(disclaimer),
      );
    }
  };

  $scope.deleteDisclaimer = function deleteDisclaimer(disclaimer) {
    if (!disclaimer.taskPendingId) {
      $scope.setAction(
        'emailpro/disclaimer/remove/emailpro-disclaimer-remove',
        angular.copy(disclaimer),
      );
    }
  };
}
