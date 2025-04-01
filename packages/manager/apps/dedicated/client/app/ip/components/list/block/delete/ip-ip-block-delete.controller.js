import { ADDITIONAL_IP, DELETE_TRACKING_PREFIX } from '../ip-ip-block.constant';

export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  Alerter,
  atInternet,
  coreConfig,
) => {
  const user = coreConfig.getUser();
  $scope.data = $scope.currentActionData;
  $scope.ADDITIONAL_IP = ADDITIONAL_IP;
  // Used for customization of the delete label
  $scope.deleteTranslationKey = `ip_table_manage_delete_ipblock${
    user.ovhSubsidiary === 'US' ? '_us' : ''
  }`;
  $scope.deleteQuestionTranslationKey = `ip_table_manage_delete_ipblock_question${
    user.ovhSubsidiary === 'US' ? '_us' : ''
  }`;

  atInternet.trackPage({
    name: DELETE_TRACKING_PREFIX,
  });
  $scope.loading = false;

  $scope.deleteIpBlock = function deleteIpBlock() {
    atInternet.trackClick({
      name: `${DELETE_TRACKING_PREFIX}::confirm`,
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
      name: `${DELETE_TRACKING_PREFIX}::cancel`,
      type: 'action',
    });
    $scope.resetAction();
  };
};
