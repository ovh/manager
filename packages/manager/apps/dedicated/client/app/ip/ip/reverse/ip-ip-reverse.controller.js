import difference from 'lodash/difference';
import remove from 'lodash/remove';

export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpReverse,
  Alerter,
  Validator,
  $q,
) => {
  $scope.data = $scope.currentActionData;

  $scope.model = {
    reverses: angular.copy($scope.data.ipBlock.reverseDelegations) || [],
    currentReverse: '',
  };

  $scope.errors = {
    INVALID_DNS: false,
    ALREADY_EXISTS: false,
  };

  // -- Step1
  $scope.addReverse = function addReverse() {
    if ($scope.model.reverses.length < 2) {
      if (~$scope.model.reverses.indexOf($scope.model.currentReverse)) {
        $scope.errors.ALREADY_EXISTS = true;
      } else {
        $scope.errors.ALREADY_EXISTS = false;
        if (
          Validator.isValidDomain(
            $scope.model.currentReverse.replace(/\.$/, ''),
          ) &&
          /\.$/.test($scope.model.currentReverse)
        ) {
          $scope.model.reverses.push($scope.model.currentReverse);
          $scope.model.currentReverse = '';
          $scope.errors.INVALID_DNS = false;
        } else {
          $scope.errors.INVALID_DNS = true;
        }
      }
    }
  };

  $scope.deleteReverse = function deleteReverse(reverse) {
    remove(
      $scope.model.reverses,
      (delegatedReverse) => reverse === delegatedReverse,
    );
  };

  // -- Step2
  $scope.loadStep2 = function loadStep2() {
    $scope.reversesToAdd = difference(
      $scope.model.reverses,
      $scope.data.ipBlock.reverseDelegations,
    );
    $scope.reversesToDelete = difference(
      $scope.data.ipBlock.reverseDelegations,
      $scope.model.reverses,
    );
  };

  $scope.isValid = function isValid() {
    $scope.reversesToAdd = difference(
      $scope.model.reverses,
      $scope.data.ipBlock.reverseDelegations,
    );
    $scope.reversesToDelete = difference(
      $scope.data.ipBlock.reverseDelegations,
      $scope.model.reverses,
    );

    return (
      ($scope.reversesToAdd.length || $scope.reversesToDelete.length) &&
      ($scope.model.reverses.length ||
        $scope.data.ipBlock.reverseDelegations.length) &&
      $scope.model.reverses.filter(
        (reverse) => !Validator.isValidDomain(reverse.replace(/\.$/, '')),
      ).length === 0
    );
  };

  $scope.addIpv6ReverseDelegation = function addIpv6ReverseDelegation() {
    $scope.resetAction();

    const queueToDelete = $scope.reversesToDelete.map((reverse) =>
      IpReverse.deleteDelegation($scope.data.ipBlock.ipBlock, reverse),
    );

    $q.all(queueToDelete).then(
      () => {
        const queueToAdd = $scope.reversesToAdd.map((reverse) =>
          IpReverse.setDelegation($scope.data.ipBlock.ipBlock, reverse),
        );
        if (queueToAdd.length) {
          $q.all(queueToAdd).then(
            () => {
              $rootScope.$broadcast(
                'ips.table.refreshBlock',
                $scope.data.ipBlock,
              );
              Alerter.success(
                $translate.instant(
                  'ip_table_manage_delegation_ipv6block_success',
                ),
              );
            },
            (err) => {
              Alerter.alertFromSWS(
                $translate.instant('ip_table_manage_delegation_ipv6block_err'),
                err,
              );
            },
          );
        } else {
          $rootScope.$broadcast('ips.table.refreshBlock', $scope.data.ipBlock);
          Alerter.success(
            $translate.instant('ip_table_manage_delegation_ipv6block_success'),
          );
        }
      },
      (err) => {
        Alerter.alertFromSWS(
          $translate.instant('ip_table_manage_delegation_ipv6block_err'),
          err,
        );
      },
    );
  };
};
