export default /* @ngInject */ (
  $scope,
  $rootScope,
  Ip,
  IpFirewall,
  $translate,
  Alerter,
  $location,
) => {
  // Hack because the condition in the template wouldn't change depending on the mitigation status
  $scope.translations = {};

  function init(data) {
    $scope.data = data || $scope.currentActionData;
    if ($scope.data.ip.firewall === 'ACTIVATED') {
      $scope.translations.wizardTitle = $translate.instant(
        'ip_firewall_disable_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'ip_firewall_disable_question',
        {
          t0: $scope.data.ip.ip,
        },
      );
    } else if ($scope.data.ip.firewall === 'DEACTIVATED') {
      $scope.translations.wizardTitle = $translate.instant(
        'ip_firewall_enable_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'ip_firewall_enable_question',
        {
          t0: $scope.data.ip.ip,
        },
      );
    } else {
      $scope.translations.wizardTitle = $translate.instant(
        'ip_firewall_new_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'ip_firewall_new_question',
        {
          t0: $scope.data.ip.ip,
        },
      );
    }
  }

  $scope.toggleFirewall = function toggleFirewall() {
    $scope.loading = true;

    let newStatus = 'NOT_CONFIGURED';

    if ($scope.data.ip.firewall === 'ACTIVATED') {
      newStatus = false;
    } else if ($scope.data.ip.firewall === 'DEACTIVATED') {
      newStatus = true;
    }

    if (newStatus === 'NOT_CONFIGURED') {
      IpFirewall.addFirewall($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
        .then(
          () => {
            $rootScope.$broadcast(
              'ips.table.refreshBlock',
              $scope.data.ipBlock,
            );
            Alerter.success(
              $translate.instant('ip_firewall_new_success', {
                t0: $scope.data.ip.ip,
              }),
            );
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('ip_firewall_new_failed', {
                t0: $scope.data.ip.ip,
              }),
              data,
            );
          },
        )
        .finally(() => {
          $scope.cancelAction();
        });
    } else {
      IpFirewall.toggleFirewall(
        $scope.data.ipBlock.ipBlock,
        $scope.data.ip.ip,
        newStatus,
      )
        .then(
          () => {
            $rootScope.$broadcast(
              'ips.table.refreshBlock',
              $scope.data.ipBlock,
            );
            if (newStatus === false) {
              Alerter.success(
                $translate.instant('ip_firewall_disable_success', {
                  t0: $scope.data.ip.ip,
                }),
              );
            } else if (newStatus === true) {
              Alerter.success(
                $translate.instant('ip_firewall_enable_success', {
                  t0: $scope.data.ip.ip,
                }),
              );
            }
          },
          (data) => {
            if (newStatus === false) {
              Alerter.alertFromSWS(
                $translate.instant('ip_firewall_disable_failed', {
                  t0: $scope.data.ip.ip,
                }),
                data,
              );
            } else if (newStatus === true) {
              Alerter.alertFromSWS(
                $translate.instant('ip_firewall_enable_failed', {
                  t0: $scope.data.ip.ip,
                }),
                data,
              );
            }
          },
        )
        .finally(() => {
          $scope.cancelAction();
        });
    }
  };

  // Come from URL
  if ($location.search().action === 'toggleFirewall' && $location.search().ip) {
    $scope.loading = true;
    IpFirewall.getFirewallDetails(
      $location.search().ipBlock,
      $location.search().ip,
    )
      .then(
        (result) => {
          init({
            ip: {
              ip: $location.search().ip,
              firewall: result.enabled ? 'ACTIVATED' : 'DEACTIVATED',
            },
            ipBlock: { ipBlock: $location.search().ipBlock },
          });
        },
        () => {
          // firewall not created > 404
          init({
            ip: { ip: $location.search().ip, firewall: 'NOT_CONFIGURED' },
            ipBlock: { ipBlock: $location.search().ipBlock },
          });
        },
      )
      .finally(() => {
        $scope.loading = false;
      });
  } else {
    init();
  }

  $scope.cancelAction = function cancelAction() {
    Ip.cancelActionParam('toggleFirewall');
    $scope.resetAction();
  };
};
