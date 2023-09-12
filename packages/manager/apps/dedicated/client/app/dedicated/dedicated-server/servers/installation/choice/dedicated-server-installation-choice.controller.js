import { BYOI_FEATURE } from '../dedicated-server-installation.constants';

angular.module('App').controller('ServerInstallationChoiceCtrl', [
  '$scope',
  '$state',
  'atInternet',
  'ovhFeatureFlipping',

  function ServerInstallationChoiceCtrl(
    $scope,
    $state,
    atInternet,
    ovhFeatureFlipping,
  ) {
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
        $scope.trackPage(
          'dedicated::dedicated::server::system-install::public-catalog',
        );
        $scope.setAction(
          'installation/ovh/dedicated-server-installation-ovh',
          $scope.currentActionData,
        );
      } else if ($scope.choice.value === $scope.choice.personal) {
        $scope.trackPage(
          'dedicated::dedicated::server::system-install::existing-template',
        );
        $scope.setAction(
          'installation/gabarit/dedicated-server-installation-gabarit',
          $scope.currentActionData,
        );
      } else if ($scope.choice.value === $scope.choice.image) {
        $scope.trackPage(
          'dedicated::dedicated::server::system-install::personalized-image',
        );
        $scope.resetAction();
        $state.go('app.dedicated-server.server.install.image');
      }
    };

    $scope.trackPage = function(name) {
      atInternet.trackPage({
        name,
        type: 'navigation',
      });
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
