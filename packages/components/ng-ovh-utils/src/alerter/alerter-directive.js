import template from './alerter.html';

export default function () {
  return {
    restrict: 'A',
    scope: {
      ovhAlert: '@',
    },
    transclude: true,
    template,
    link($scope, $elm, $attr) {
      function checkForGlobalOrId(id) {
        return (!$scope.ovhAlert && !id) || ($scope.ovhAlert && id === $scope.ovhAlert);
      }

      $scope.$on('ovhAlert.show', (event, type, message, details, alertId) => {
        if (checkForGlobalOrId(alertId)) {
          $scope.ovhAlertMessage = message;
          $scope.ovhAlertMessageDetails = details;
          $scope.ovhAlertType = type;
        }
      });

      $scope.$on('ovhAlert.resetMessage', (event, alertId) => {
        if (checkForGlobalOrId(alertId)) {
          $scope.resetMessages();
        }
      });

      $scope.resetMessages = function resetMessages() {
        $scope.ovhAlertMessage = null;
        $scope.ovhAlertMessageDetails = null;
      };

      $scope.expandDetails = function () {
        $scope.expand = !$scope.expand;
      };

      if ($attr.ovhAlertHideRemoveButton !== undefined) {
        $scope.ovhAlertHideRemoveButton = true;
      }
    },
  };
}
