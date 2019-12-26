import angular from 'angular';
import set from 'lodash/set';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  EmailPro,
  EmailProExternalContacts,
) => {
  $scope.model = {
    currentAccount: $scope.currentActionData,
    newAccount: angular.copy($scope.currentActionData),
    hasDisplayNameBeenModified: false,
  };

  $scope.isEmailValid = function isEmailValid() {
    return (
      $scope.model.newAccount.externalEmailAddress &&
      EmailPro.isEmailValid($scope.model.newAccount.externalEmailAddress)
    );
  };

  $scope.getPasswordInvalidClass = function getPasswordInvalidClass() {
    return !$scope.model.newAccount.externalEmailAddress ||
      EmailPro.isEmailValid($scope.model.newAccount.externalEmailAddress)
      ? ''
      : 'error';
  };

  $scope.modifyContact = function modifyContact() {
    $scope.resetAction();
    EmailProExternalContacts.modifyContact(
      $stateParams.organization,
      $stateParams.productId,
      $scope.model.currentAccount.externalEmailAddress,
      $scope.model.newAccount,
    ).then(
      () => {
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_modify_success',
          ),
          { status: 'success' },
        );
      },
      (err) => {
        set(err, 'status', err.status || 'error');
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_modify_fail',
          ),
          err,
        );
      },
    );
  };

  $scope.updateDisplayName = function updateDisplayName() {
    if ($scope.model.newAccount && !$scope.model.hasDisplayNameBeenModified) {
      let result = '';
      if ($scope.model.newAccount.firstName) {
        result = $scope.model.newAccount.firstName;
        if ($scope.model.newAccount.lastName) {
          result += ' ';
        }
      }
      if ($scope.model.newAccount.lastName) {
        result += $scope.model.newAccount.lastName;
      }
      $scope.model.newAccount.displayName = result;
    }
  };

  $scope.updateDisplayNameFlag = function updateDisplayNameFlag() {
    if ($scope.model.newAccount.displayName) {
      $scope.model.hasDisplayNameBeenModified = true;
    } else {
      $scope.model.hasDisplayNameBeenModified = false;
    }
  };

  $scope.accountIsValid = function accountIsValid() {
    return (
      EmailProExternalContacts.isAccountValid($scope.model.newAccount) &&
      $scope.model.newAccount.displayName
    );
  };
};
