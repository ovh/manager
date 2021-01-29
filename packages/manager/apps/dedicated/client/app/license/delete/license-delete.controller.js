import get from 'lodash/get';

angular
  .module('Module.license')
  .controller(
    'LicenseDeleteCtrl',
    ($scope, $translate, atInternet, License, Alerter) => {
      $scope.model = {
        license: $scope.currentActionData.license,
        deleting: false,
        deleted: false,
      };

      $scope.deleteLicense = function deleteLicense() {
        $scope.atInternet.trackClick({
          name: 'dedicated::license::delete::confirm',
          type: 'action',
        });
        if (!$scope.model.deleting && !$scope.model.deleted) {
          $scope.model.deleting = true;
          License.terminate($scope.model.license.id, $scope.model.license)
            .then(
              () => {
                $scope.model.deleting = false;
                $scope.model.deleted = true;
                Alerter.success($translate.instant('license_delete_success'));
              },
              (err) => {
                if (get(err, 'status') === 460) {
                  return Alerter.alertFromSWS(
                    $translate.instant('license_delete_already_terminating'),
                  );
                }
                return Alerter.alertFromSWS(
                  $translate.instant('license_delete_fail'),
                  err.data.message,
                );
              },
            )
            .finally(() => {
              $scope.resetAction();
            });
        } else {
          $scope.resetAction();
        }
      };
    },
  );
