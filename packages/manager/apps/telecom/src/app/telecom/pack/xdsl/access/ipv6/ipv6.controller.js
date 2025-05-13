import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function XdslAccessIpv6Ctrl(
  $stateParams,
  $scope,
  $translate,
  OvhApiXdslIps,
  TucToast,
  TucToastError,
) {
  this.submitIp = function submitIp() {
    if (isEmpty($stateParams.serviceName)) {
      TucToast.error($translate.instant('xdsl_access_ipv6_an_error_ocurred'));
    }

    OvhApiXdslIps.v6().setIpv6(
      { xdslId: $stateParams.serviceName },
      { enabled: $scope.access.xdsl.ipv6Enabled },
      (result) => {
        if (result.status === 'todo' || result.status === 'doing') {
          $scope.access.tasks.current[result.function] = true;
        }
        if ($scope.access.xdsl.ipv6Enabled) {
          TucToast.success(
            $translate.instant('xdsl_access_ipv6_success_validation_on'),
          );
        } else {
          TucToast.success(
            $translate.instant('xdsl_access_ipv6_success_validation_off'),
          );
        }
      },
      (err) => {
        $scope.access.xdsl.ipv6Enabled = !$scope.access.xdsl.ipv6Enabled;
        return new TucToastError(err, 'xdsl_access_ipv6_an_error_ocurred');
      },
    );
  };

  this.undo = function undo() {
    $scope.access.xdsl.ipv6Enabled = !$scope.access.xdsl.ipv6Enabled;
  };

  function init() {
    // if task in progress -> it means that ipv6Enabled is going to change
    if ($scope.access.tasks.current.routingIpv6) {
      $scope.access.xdsl.ipv6Enabled = !$scope.access.xdsl.ipv6Enabled;
    }

    const title = $translate.instant(
      $scope.access.xdsl.ipv6Enabled
        ? 'xdsl_access_ipv6_status'
        : 'xdsl_access_ipv6_status_off',
    );
    const question = $translate.instant(
      $scope.access.xdsl.ipv6Enabled
        ? 'xdsl_access_ipv6_really_off'
        : 'xdsl_access_ipv6_really_on',
    );
    $scope.message = `<h3>${title}</h3> ${question}
                      <div class='text-warning'>{{ 'xdsl_access_ipv6_warning' | translate }}</div>`;
    if ($scope.access.isZyxel) {
      $scope.message +=
        "<div class='text-warning'>{{ 'xdsl_access_ipv6_zyxel_warning' | translate }}</div>";
    }
  }

  init();
}
