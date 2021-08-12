import config from '../config/config';

export default /* @ngInject */ function LicenseDetailsCtrl(
  $q,
  $scope,
  $translate,
  License,
  $stateParams,
  $timeout,
  $location,
  constants,
  $window,
  Alerter,
  ovhFeatureFlipping,
) {
  $scope.loadLicense = true;

  $scope.licenseTypes = {
    CPANEL: 'CPANEL',
    DIRECTADMIN: 'DIRECTADMIN',
    PLESK: 'PLESK',
    SPLA: 'SPLA',
    VIRTUOZZO: 'VIRTUOZZO',
    WINDOWS: 'WINDOWS',
  };

  $scope.canRevoke = true;
  $scope.changeOsTaskRunning = false;
  let changeOsPollingId;

  function fetchLicense() {
    return License.get('/{licenseId}', {
      urlParams: $stateParams,
    })
      .then((license) => {
        $scope.license = license;

        if ($scope.license.expiration !== null) {
          $scope.license.isExpired = moment().isAfter(
            moment($scope.license.expiration, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          );
          $scope.license.expireSoon = moment()
            .add(1, 'months')
            .isAfter(
              moment($scope.license.expiration, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            );
        }

        return $scope.license;
      })
      .catch(() => {
        Alerter.alertFromSWS(
          $translate.instant('license_details_loading_error'),
        );
      });
  }

  function fetchIsChangeOsTaskPending(licence) {
    return License.tasks(licence, 'changeOs')
      .then((tasks) => tasks && tasks.length > 0)
      .then((isTaskRunning) => {
        // The task just finished so we refresh the licence informations.
        if (!isTaskRunning && $scope.changeOsTaskRunning) {
          fetchLicense();
        }
        $scope.changeOsTaskRunning = isTaskRunning;

        return isTaskRunning;
      })
      .catch(() => {
        Alerter.alertFromSWS(
          $translate.instant('license_directadmin_changeOs_loading_error'),
        );
      });
  }

  function pollChangeOsTaskPending(licence) {
    return fetchIsChangeOsTaskPending(licence).then(() => {
      if (!changeOsPollingId) {
        changeOsPollingId = $window.setInterval(() => {
          fetchIsChangeOsTaskPending(licence);
        }, 5000);

        $scope.$on('$destroy', () => {
          $window.clearInterval(changeOsPollingId);
        });
      }
    });
  }

  function checkUpgradeAvailability() {
    return ovhFeatureFlipping
      .checkFeatureAvailability(['license:upgrade'])
      .then((commitmentAvailability) => {
        $scope.canUpgrade = commitmentAvailability.isFeatureAvailable(
          'license:upgrade',
        );
      })
      .catch(() => {
        $scope.canUpgrade = false;
      });
  }

  function get() {
    $scope.loadLicense = true;

    return $q
      .all({
        license: fetchLicense(),
        upgradeAvailability: checkUpgradeAvailability(),
      })
      .then(({ license }) => {
        if (license.type !== 'SPLA') {
          pollChangeOsTaskPending(license);
        }
      })
      .then(() => {
        $scope.loadLicense = false;
      });
  }

  $scope.$on('licence.details.reload', () => {
    $scope.canRevoke = false;
    get();
  });

  $scope.selectTextareaContent = () => {
    angular.element('#licensekey').select();
  };

  $scope.resetAction = () => {
    $scope.setAction(false);
  };

  $scope.setAction = (action, data) => {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;
      $scope.stepPath = `license/${$scope.currentAction}.html`;
      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $scope.currentActionData = null;
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };

  $scope.upgradeLicense = () =>
    $location.path(`/configuration/license/upgrade/${$scope.license.id}`);

  $scope.$on('License.Details.Refresh', () => get());

  $scope.getRenewUrl = () => {
    if (!$scope.user) {
      return constants.renew.replace('{serviceName}', '');
    }
    const renewUrl = config.constants.billingRenew[$scope.user.ovhSubsidiary];

    if (!renewUrl) {
      return constants.renew.replace('{serviceName}', '');
    }
    return renewUrl.replace('{serviceName}', '');
  };

  get();
}
