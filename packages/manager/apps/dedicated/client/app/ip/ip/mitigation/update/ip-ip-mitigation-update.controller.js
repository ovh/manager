export default /* @ngInject */ (
  $scope,
  $rootScope,
  Ip,
  IpMitigation,
  $translate,
  Alerter,
  $location,
  atInternet,
) => {
  $scope.translations = {};

  function init(data) {
    $scope.data = data || $scope.currentActionData;
    atInternet.trackPage({
      name: $scope.data?.tracking,
    });
    $scope.mitigationStatusAuto =
      !$scope.data.ip.mitigation || $scope.data.ip.mitigation === 'DEFAULT'; // Hack for the wizard status

    // Hack because the condition in the template wouldn't change depending on the mitigation status
    if ($scope.mitigationStatusAuto) {
      $scope.translations.wizardTitle = $translate.instant(
        'ip_mitigation_permanent_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'ip_mitigation_permanent_question',
        {
          t0: $scope.data.ip.ip,
        },
      );
    } else {
      $scope.translations.wizardTitle = $translate.instant(
        'ip_mitigation_auto_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'ip_mitigation_auto_question',
        {
          t0: $scope.data.ip.ip,
        },
      );
    }
  }

  $scope.updateMitigation = function updateMitigation() {
    $scope.loading = true;
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::confirm`,
      type: 'action',
    });
    // Toggle between the two mitigation status that can be changed
    let newMitigationStatus = 'DEFAULT';
    if ($scope.mitigationStatusAuto) {
      newMitigationStatus = 'PERMANENT';
    }

    IpMitigation.updateMitigation(
      $scope.data.ipBlock.ipBlock,
      $scope.data.ip.ip,
      newMitigationStatus,
    )
      .then(
        (data) => {
          if (newMitigationStatus === 'DEFAULT') {
            Alerter.alertFromSWS(
              $translate.instant('ip_mitigation_auto_success', {
                t0: $scope.data.ip.ip,
              }),
              data,
            );
          } else {
            Alerter.alertFromSWS(
              $translate.instant('ip_mitigation_permanent_success', {
                t0: $scope.data.ip.ip,
              }),
              data,
            );
          }
          $rootScope.$broadcast('ips.table.refreshBlock', $scope.data.ipBlock);
        },
        (data) => {
          if (newMitigationStatus === 'DEFAULT') {
            Alerter.alertFromSWS(
              $translate.instant('ip_mitigation_auto_failed', {
                t0: $scope.data.ip.ip,
              }),
              data,
            );
          } else {
            Alerter.alertFromSWS(
              $translate.instant('ip_mitigation_permanent_failed', {
                t0: $scope.data.ip.ip,
              }),
              data,
            );
          }
        },
      )
      .finally(() => {
        Ip.cancelActionParam('mitigation');
        $scope.resetAction();
      });
  };

  // Come from URL
  if ($location.search().action === 'mitigation' && $location.search().ip) {
    IpMitigation.getMitigationDetails(
      $location.search().ipBlock,
      $location.search().ip,
    )
      .then((result) => {
        init({
          ip: {
            ip: $location.search().ip,
            mitigation: result.permanent,
          },
          ipBlock: {
            ipBlock: $location.search().ipBlock,
            serviceName: $location.search().ip,
          },
        });
      })
      .catch(() => {
        init({
          ip: {
            ip: $location.search().ip,
          },
          ipBlock: {
            ipBlock: $location.search().ipBlock,
            serviceName: $location.search().ip,
          },
        });
      });
  } else {
    init();
  }

  $scope.cancelAction = function cancelAction() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::cancel`,
      type: 'action',
    });
    Ip.cancelActionParam('mitigation');
    $scope.resetAction();
  };
};
