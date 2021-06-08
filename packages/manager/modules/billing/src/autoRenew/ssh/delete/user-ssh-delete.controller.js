import get from 'lodash/get';

export default /* @ngInject */ function UserAccountSshDeleteController(
  $scope,
  $translate,
  UseraccountSshService,
  Alerter,
) {
  $scope.data = $scope.currentActionData;

  $scope.deleteSshKey = function deleteSshKey() {
    $scope.resetAction();
    const promise =
      $scope.data.category === 'dedicated'
        ? UseraccountSshService.deleteDedicatedSshKey($scope.data.keyName)
        : UseraccountSshService.deleteCloudSshKey(
            $scope.data.serviceName,
            $scope.data.id,
          );

    promise.then(
      () => {
        Alerter.success(
          $translate.instant('user_ssh_delete_success_message'),
          'userSsh',
        );
      },
      (err) => {
        Alerter.error(
          `${$translate.instant('user_ssh_delete_error_message')} ${get(
            err,
            'message',
          ) || err}`,
          'userSsh',
        );
      },
    );
  };
}
