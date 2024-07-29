import { ADDITIONAL_IP, POLLING_INTERVAL } from '../ip-ip-block.constant';
import { IPV6_GUIDES_LINK } from '../../../../../../../../../modules/vrack/src/vrack-associated-services/ipv6/ipv6.constant';

export default /* @ngInject */ (
  $scope,
  $timeout,
  OvhApiVrack,
  $q,
  $translate,
  Ip,
  Vrack,
  Alerter,
  atInternet,
  coreConfig,
) => {
  const user = coreConfig.getUser();
  $scope.data = $scope.currentActionData;
  $scope.model = { serviceName: null, nexthop: null };
  $scope.noTasksPending = false;
  $scope.ipCanBeMovedTo = false;
  $scope.ipCanBeMovedToError = '';
  $scope.ADDITIONAL_IP = ADDITIONAL_IP;
  $scope.helpLink =
    IPV6_GUIDES_LINK[user.ovhSubsidiary] || IPV6_GUIDES_LINK.DEFAULT;
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

    if ($scope.data.ipBlock.isAdditionalIpv6) {
      queue.push(
        Vrack.getIpInfo($scope.data.ipBlock.ipBlock).then(({ data }) => {
          $scope.data.ipBlock = { ...$scope.data.ipBlock, ...data };
        }),
      );

      queue.push(
        Vrack.getVrackService().then((result) => {
          $scope.ipDestinations = result;
          $scope.ipDestinations.push({
            service: $translate.instant('ip_servicetype__PARK'),
            serviceType: '_PARK',
            nexthop: [],
          });
        }),
      );
    } else {
      queue.push(
        Ip.getIpMove($scope.data.ipBlock.ipBlock).then((result) => {
          $scope.ipDestinations = result;
          $scope.ipDestinations.push({
            service: $translate.instant('ip_servicetype__PARK'),
            serviceType: '_PARK',
            nexthop: [],
          });
        }),
      );
    }

    return $q
      .all(queue)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        $scope.loading.init = false;
      });
  }

  $scope.checkIfIpCanBeMovedTo = function checkIfIpCanBeMovedTo() {
    if (
      $scope.model.serviceName !== '_PARK' &&
      $scope.model.service.type !== 'ipv6'
    ) {
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

  $scope.moveIpv6Action = (serviceName, ipBlock) => {
    Vrack.addIpv6(serviceName, ipBlock)
      .then(({ data }) => {
        $scope.watingTask(data.id, serviceName, () => {
          $scope.loading.save = false;
          $scope.resetAction();
        });
      })
      .catch((err) => {
        Alerter.alertFromSWS(
          $translate.instant('ip_table_manage_move_ipblock_failure', {
            t0: $scope.data.ipBlock.ipBlock,
            t1: $scope.model.serviceName.service,
          }),
          err,
        );
        $scope.resetAction();
      });
  };

  $scope.moveIpBlock = function moveIpBlock() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::confirm`,
      type: 'action',
    });
    $scope.loading.save = true;
    if ($scope.data.ipBlock.isAdditionalIpv6) {
      if ($scope.data.ipBlock.routedTo?.serviceName) {
        Vrack.deleteIpv6(
          $scope.data.ipBlock.routedTo?.serviceName,
          $scope.data.ipBlock.ipBlock,
        )
          .then(({ data }) => {
            $scope.watingTask(
              data.id,
              $scope.data.ipBlock.routedTo?.serviceName,
              () => {
                if ($scope.model.serviceName.serviceType !== '_PARK') {
                  this.moveIpv6Action(
                    $scope.model.serviceName.service,
                    $scope.data.ipBlock.ipBlock,
                  );
                } else {
                  $scope.resetAction();
                }
              },
            );
          })
          .catch((err) => {
            console.log(err);
            Alerter.alertFromSWS(
              $translate.instant('ip_table_manage_move_ipblock_failure', {
                t0: $scope.data.ipBlock.ipBlock,
                t1: $scope.model.serviceName.service,
              }),
              err,
            );
            $scope.resetAction();
          });
      } else {
        this.moveIpv6Action(
          $scope.model.serviceName.service,
          $scope.data.ipBlock.ipBlock,
        );
      }
    } else if ($scope.model.serviceName.serviceType === '_PARK') {
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

  $scope.watingTask = (taskId, serviceName, callback) => {
    OvhApiVrack.v6()
      .task({
        serviceName,
        taskId,
      })
      .$promise.then(() => {
        $timeout(() => {
          $scope.watingTask(taskId, serviceName, callback);
        }, POLLING_INTERVAL);
      })
      .catch(() => {
        if (callback) callback();
      });
  };

  init();
};
