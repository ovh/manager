import get from 'lodash/get';

export default /* @ngInject */ function UserAccountSshDedicatedAddController(
  $scope,
  $timeout,
  $translate,
  Alerter,
  atInternet,
  UseraccountSshService,
) {
  const fullSshList = $scope.currentActionData || [];

  $scope.model = {};
  $scope.sshKeyAlreadyCreatedError = false;

  $scope.addDedicatedSshKey = function addDedicatedSshKey() {
    UseraccountSshService.addDedicatedSshKey($scope.model)
      .then(() => {
        Alerter.success(
          $translate.instant('user_ssh_add_success_message'),
          'userSsh',
        );
      })
      .catch((err) => {
        Alerter.error(
          `${this.$translate.instant('user_ssh_add_error_message')} ${get(
            err,
            'message',
          ) || err}`,
          'userSsh',
        );
      })
      .finally(() => {
        atInternet.trackClick({
          name: 'validation_add_ssh_key',
          type: 'action',
          chapter1: 'account',
          chapter2: 'ssh',
          chapter3: 'dedicated',
        });
      });
    $scope.resetAction();
  };

  $scope.formIsValid = function formIsValid() {
    if ($scope.model.keyName && ~fullSshList.indexOf($scope.model.keyName)) {
      $scope.sshKeyAlreadyCreatedError = true;
      return false;
    }
    if (!$scope.model.keyName || !$scope.model.keyIsValid) {
      $scope.sshKeyAlreadyCreatedError = false;
      return false;
    }
    $scope.sshKeyAlreadyCreatedError = false;
    return true;
  };

  $timeout(() => {
    angular.element('#sshAddKeyNameLabel').focus();
  }, 600);
}
