angular.module('UserAccount').controller('UserAccount.controllers.ssh.dedicated.add', [
  '$scope',
  '$timeout',
  '$translate',
  'Alerter',
  'atInternet',
  'UseraccountSshService',
  function ($scope, $timeout, $translate, Alerter, atInternet, UseraccountSsh) {
    const fullSshList = $scope.currentActionData || [];

    $scope.model = {};
    $scope.sshKeyAlreadyCreatedError = false;

    $scope.addDedicatedSshKey = function () {
      UseraccountSsh.addDedicatedSshKey($scope.model).then(
        () => {
          Alerter.success($translate.instant('user_ssh_add_success_message'));
        },
      )
        .catch((failure) => {
          Alerter.alertFromSWS($translate.instant('user_ssh_add_error_message'), failure.data);
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

    $scope.formIsValid = function () {
      if ($scope.model.keyName && ~fullSshList.indexOf($scope.model.keyName)) {
        $scope.sshKeyAlreadyCreatedError = true;
        return false;
      } if (!$scope.model.keyName || !$scope.model.keyIsValid) {
        $scope.sshKeyAlreadyCreatedError = false;
        return false;
      }
      $scope.sshKeyAlreadyCreatedError = false;
      return true;
    };

    $timeout(() => {
      angular.element('#sshAddKeyNameLabel').focus();
    }, 600);
  },
]);
