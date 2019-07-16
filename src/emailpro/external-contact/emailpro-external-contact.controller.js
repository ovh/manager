angular.module('Module.emailpro.controllers').controller('EmailProAddExternalContactCtrl', ($scope, $stateParams, $translate, EmailPro, EmailProExternalContacts) => {
  $scope.model = {
    newAccount: {
      hiddenFromGAL: false,
    },
    hasDisplayNameBeenModified: false,
  };

  $scope.init = function () {
    EmailPro.getSelected().then((exchange) => {
      if (exchange.serverDiagnostic.version === 14
        && exchange.offer === EmailPro.accountTypeProvider) {
        EmailProExternalContacts
          .getContactOptions($stateParams.organization, $stateParams.productId)
          .then((data) => {
            $scope.availableMainDomains = data;
            $scope.model.attachOrganization2010 = _.first($scope.availableMainDomains);
          })
          .catch((failure) => {
            $scope.resetAction();
            $scope.setMessage($translate.instant('emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_add_fail'), failure.data);
          });
      }
    });
  };

  $scope.isEmailValid = function () {
    return $scope.model.newAccount.externalEmailAddress
      && EmailPro.isEmailValid($scope.model.newAccount.externalEmailAddress);
  };

  $scope.getPasswordInvalidClass = function () {
    return !$scope.model.newAccount.externalEmailAddress
      || EmailPro.isEmailValid($scope.model.newAccount.externalEmailAddress) ? '' : 'error';
  };

  $scope.addContact = function () {
    $scope.resetAction();
    if ($scope.model.attachOrganization2010) {
      $scope.model.newAccount.organization2010 = $scope.model.attachOrganization2010.name;
    }

    EmailProExternalContacts
      .addContact($stateParams.organization, $stateParams.productId, $scope.model.newAccount)
      .then(() => {
        $scope.setMessage($translate.instant('emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_add_success'), { status: 'success' });
      })
      .catch((failure) => {
        _.set(failure, 'status', 'error');
        $scope.setMessage($translate.instant('emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_add_fail'), failure);
      });
  };

  $scope.updateDisplayName = function () {
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

  $scope.updateDisplayNameFlag = function () {
    if ($scope.model.newAccount.displayName) {
      $scope.model.hasDisplayNameBeenModified = true;
    } else {
      $scope.model.hasDisplayNameBeenModified = false;
    }
  };

  $scope.accountIsValid = function () {
    return EmailProExternalContacts.isAccountValid($scope.model.newAccount);
  };
});

angular.module('Module.emailpro.controllers').controller('EmailProExternalContactsModifyCtrl', ($scope, $stateParams, $translate, EmailPro, EmailProExternalContacts) => {
  $scope.model = {
    currentAccount: $scope.currentActionData,
    newAccount: angular.copy($scope.currentActionData),
    hasDisplayNameBeenModified: false,
  };

  $scope.isEmailValid = function () {
    return $scope.model.newAccount.externalEmailAddress
      && EmailPro.isEmailValid($scope.model.newAccount.externalEmailAddress);
  };

  $scope.getPasswordInvalidClass = function () {
    return !$scope.model.newAccount.externalEmailAddress
      || EmailPro.isEmailValid($scope.model.newAccount.externalEmailAddress) ? '' : 'error';
  };

  $scope.modifyContact = function () {
    $scope.resetAction();
    EmailProExternalContacts
      .modifyContact(
        $stateParams.organization,
        $stateParams.productId,
        $scope.model.currentAccount.externalEmailAddress,
        $scope.model.newAccount,
      )
      .then(() => {
        $scope.setMessage($translate.instant('emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_modify_success'), { status: 'success' });
      }, (err) => {
        _.set(err, 'status', err.status || 'error');
        $scope.setMessage($translate.instant('emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_modify_fail'), err);
      });
  };

  $scope.updateDisplayName = function () {
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

  $scope.updateDisplayNameFlag = function () {
    if ($scope.model.newAccount.displayName) {
      $scope.model.hasDisplayNameBeenModified = true;
    } else {
      $scope.model.hasDisplayNameBeenModified = false;
    }
  };

  $scope.accountIsValid = function () {
    return EmailProExternalContacts.isAccountValid($scope.model.newAccount)
      && $scope.model.newAccount.displayName;
  };
});

angular.module('Module.emailpro.controllers').controller('EmailProExternalContactsDeleteCtrl', ($scope, $stateParams, $translate, EmailPro, EmailProExternalContacts) => {
  $scope.model = {
    externalEmailAddress: $scope.currentActionData,
  };

  $scope.deleteAccount = function () {
    $scope.resetAction();
    EmailProExternalContacts
      .removeContact(
        $stateParams.organization,
        $stateParams.productId,
        $scope.model.externalEmailAddress,
      )
      .then(() => {
        $scope.setMessage($translate.instant('emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_delete_success'), { status: 'success' });
      })
      .catch((err) => {
        _.set(err, 'status', err.status || 'error');
        $scope.setMessage($translate.instant('emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_delete_fail'), err);
      });
  };
});
