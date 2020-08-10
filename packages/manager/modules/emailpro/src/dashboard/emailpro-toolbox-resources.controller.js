import angular from 'angular';

export default /* @ngInject */ function($scope, EmailPro) {
  $scope.stateOk = EmailPro.stateOk;

  $scope.updateResource = function updateResource(resource) {
    if (resource.state === $scope.stateOk) {
      $scope.setAction(
        'emailpro/resource/update/emailpro-resource-update',
        angular.copy(resource),
      );
    }
  };

  $scope.resourceDelegation = function resourceDelegation(resource) {
    if (resource.state === $scope.stateOk) {
      $scope.setAction(
        'emailpro/resource/delegation/emailpro-resource-delegation',
        angular.copy(resource),
      );
    }
  };

  $scope.deleteResource = function deleteResource(resource) {
    if (resource.state === $scope.stateOk) {
      $scope.setAction(
        'emailpro/resource/remove/emailpro-resource-remove',
        angular.copy(resource),
      );
    }
  };
}
