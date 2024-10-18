import { ADDITIONAL_IP, IP_SERVICETYPE__PARK } from '../ip-ip-block.constant';

export default /* @ngInject */ (
  $scope,
  $q,
  $translate,
  Ip,
  Alerter,
  atInternet,
) => {
  $scope.data = $scope.currentActionData;
  $scope.model = { serviceName: null, nexthop: null };
  $scope.noTasksPending = false;
  $scope.ipCanBeMovedTo = false;
  $scope.ipCanBeMovedToError = '';
  $scope.ADDITIONAL_IP = ADDITIONAL_IP;
  $scope.IP_SERVICETYPE__PARK = IP_SERVICETYPE__PARK;

  $scope.loading = {
    init: true,
    ipCanBeMovedTo: true,
    save: false,
  };

  function init() {
    atInternet.trackPage({
      name: $scope.data?.tracking,
    });
    const queue = [];
    queue.push(
      Ip.checkTaskUnique(
        $scope.data.ipBlock.ipBlock,
        'genericMoveFloatingIp',
      ).then((tasks) => {
        $scope.noTasksPending = !(tasks && tasks.length);
      }),
    );
    queue.push(
      Ip.getIpMove($scope.data.ipBlock.ipBlock).then((result) => {
        $scope.ipDestinations = result;
        $scope.ipDestinations.push({
          service: IP_SERVICETYPE__PARK,
          serviceType: '_PARK',
          nexthop: [],
        });
      }),
    );
    return $q.all(queue).finally(() => {
      $scope.loading.init = false;
    });
  }

  $scope.checkIfIpCanBeMovedTo = function checkIfIpCanBeMovedTo() {
    if ($scope.model.serviceName !== '_PARK') {
      $scope.ipCanBeMovedToError = '';
      $scope.loading.ipCanBeMovedTo = true;
      Ip.checkIfIpCanBeMovedTo(
        $scope.model.serviceName,
        $scope.data.ipBlock.ipBlock,
      )
        .then(
          () => {
            $scope.ipCanBeMovedTo = true;
          },
          (data) => {
            if (data && data.message) {
              $scope.ipCanBeMovedToError = data.message;
            }
            $scope.ipCanBeMovedTo = false;
          },
        )
        .finally(() => {
          $scope.loading.ipCanBeMovedTo = false;
        });
    } else {
      $scope.ipCanBeMovedTo = true;
      $scope.loading.ipCanBeMovedTo = false;
    }
  };

  $scope.moveIpBlock = function moveIpBlock() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::confirm`,
      type: 'action',
    });
    $scope.loading.save = true;
    if ($scope.model.serviceName.serviceType === '_PARK') {
      Ip.moveIpBlockToPark($scope.data.ipBlock.ipBlock)
        .then(
          () => {
            Alerter.success(
              $translate.instant('ip_table_manage_move_ipblock_success', {
                t0: $scope.data.ipBlock.ipBlock,
                t1:
                  $translate.instant(
                    `ip_service${$scope.model.serviceName.service}`,
                  ) || $scope.model.serviceName.service,
              }),
            );
          },
          (reason) => {
            Alerter.alertFromSWS(
              $translate.instant('ip_table_manage_move_ipblock_failure', {
                t0: $scope.data.ipBlock.ipBlock,
                t1:
                  $translate.instant(
                    `ip_service${$scope.model.serviceName.service}`,
                  ) || $scope.model.serviceName.service,
              }),
              reason,
            );
          },
        )
        .finally(() => {
          $scope.resetAction();
        });
    } else {
      Ip.moveIpBlock(
        $scope.model.serviceName.service,
        $scope.data.ipBlock.ipBlock,
        $scope.model.nexthop,
      )
        .then(
          () => {
            Alerter.success(
              $translate.instant('ip_table_manage_move_ipblock_success', {
                t0: $scope.data.ipBlock.ipBlock,
                t1: $scope.model.serviceName.service,
              }),
            );
          },
          (reason) => {
            Alerter.alertFromSWS(
              $translate.instant('ip_table_manage_move_ipblock_failure', {
                t0: $scope.data.ipBlock.ipBlock,
                t1: $scope.model.serviceName.service,
              }),
              reason,
            );
          },
        )
        .finally(() => {
          $scope.resetAction();
        });
    }
  };

  $scope.canMove = () => {
    const serviceNameChoosed =
      $scope.model.serviceName &&
      $scope.model.serviceName.service &&
      $scope.noTasksPending;
    const nextHopSelectedPCC = () =>
      $scope.model.serviceName.serviceType === 'dedicatedCloud' &&
      $scope.model.nexthop;
    const nextHopSelectedOther = () =>
      $scope.model.serviceName.serviceType !== 'dedicatedCloud';

    return (
      serviceNameChoosed && (nextHopSelectedPCC() || nextHopSelectedOther())
    );
  };
  $scope.onCancelAction = function onCancelAction() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::cancel`,
      type: 'action',
    });
    $scope.resetAction();
  };
  $scope.onNextAction = function() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::next`,
      type: 'action',
    });
  };

  $scope.onPreviousAction = function() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::back`,
      type: 'action',
    });
  };
  $scope.onBackAction = function onBackAction() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::back`,
      type: 'action',
    });
    return $scope.loading.save;
  };

  init();
};
