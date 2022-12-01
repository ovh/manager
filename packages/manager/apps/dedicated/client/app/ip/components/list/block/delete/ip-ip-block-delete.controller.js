import { ADDITIONAL_IP } from '../ip-ip-block.constant';

export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  Alerter,
  atInternet,
) => {
  $scope.data = $scope.currentActionData;
  $scope.ADDITIONAL_IP = ADDITIONAL_IP;
  atInternet.trackPage({
    name: $scope.data?.tracking,
  });
  $scope.loading = false;

  $scope.deleteIpBlock = function deleteIpBlock() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::confirm`,
      type: 'action',
    });
    $scope.loading = true;
    Ip.deleteIpBlock($scope.data.ipBlock.ipBlock)
      .then(
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_table_manage_delete_ipblock_success'),
            data,
          );
        },
        (reason) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_table_manage_delete_ipblock_failure', {
              t0: $scope.data.ipBlock.ipBlock,
            }),
            reason,
          );
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
  $scope.cancelAction = function cancelAction() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::cancel`,
      type: 'action',
    });
    $scope.resetAction();
  };
};
