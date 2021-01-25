import { BYOI_FEATURE } from '../dedicated-server-installation.constants';

angular.module('App').controller('ServerInstallationChoiceCtrl', [
  '$scope',
  '$state',
  'ovhFeatureFlipping',

  function ServerInstallationChoiceCtrl($scope, $state, ovhFeatureFlipping) {
    $scope.loading = {
      featureAvailability: false,
    };

    $scope.choice = {
      value: 1,
      ovh: 1,
      personal: 2,
      image: 3,
    };

    $scope.goInstall = function goInstall() {
      if ($scope.choice.value === $scope.choice.ovh) {
        $scope.setAction(
          'installation/ovh/dedicated-server-installation-ovh',
          $scope.currentActionData,
        );
      } else if ($scope.choice.value === $scope.choice.personal) {
        $scope.setAction(
          'installation/gabarit/dedicated-server-installation-gabarit',
          $scope.currentActionData,
        );
      } else if ($scope.choice.value === $scope.choice.image) {
        $scope.resetAction();
        $state.go('app.dedicated.server.install.image');
      }
    };

    $scope.load = function() {
      $scope.loading.featureAvailability = true;

      return ovhFeatureFlipping
        .checkFeatureAvailability(BYOI_FEATURE)
        .then((byoiFeatureResult) => {
          $scope.isByoiAvailable = byoiFeatureResult.isFeatureAvailable(
            BYOI_FEATURE,
          );
        })
        .finally(() => {
          $scope.loading.featureAvailability = false;
        });
    };
  },
]);
