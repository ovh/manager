import get from 'lodash/get';

angular.module('UserAccount').controller('UserAccount.controllers.ssh.delete', [
  '$scope',
  '$translate',
  'UseraccountSshService',
  'Alerter',
  function UserAccountSshDeleteController(
    $scope,
    $translate,
    UseraccountSsh,
    Alerter,
  ) {
    $scope.data = $scope.currentActionData;

    $scope.deleteSshKey = function deleteSshKey() {
      $scope.resetAction();
      const promise =
        $scope.data.category === 'dedicated'
          ? UseraccountSsh.deleteDedicatedSshKey($scope.data.keyName)
          : UseraccountSsh.deleteCloudSshKey(
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
  },
]);
