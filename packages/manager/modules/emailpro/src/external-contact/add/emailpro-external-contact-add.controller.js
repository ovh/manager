import head from 'lodash/head';
import set from 'lodash/set';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  EmailPro,
  EmailProExternalContacts,
) => {
  $scope.model = {
    newAccount: {
      hiddenFromGAL: false,
    },
    hasDisplayNameBeenModified: false,
  };

  $scope.init = function init() {
    EmailPro.getSelected().then((exchange) => {
      if (
        exchange.serverDiagnostic.version === 14 &&
        exchange.offer === EmailPro.accountTypeProvider
      ) {
        EmailProExternalContacts.getContactOptions(
          $stateParams.organization,
          $stateParams.productId,
        )
          .then((data) => {
            $scope.availableMainDomains = data;
            $scope.model.attachOrganization2010 = head(
              $scope.availableMainDomains,
            );
          })
          .catch((failure) => {
            $scope.resetAction();
            $scope.setMessage(
              $translate.instant(
                'emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_add_fail',
              ),
              failure.data,
            );
          });
      }
    });
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

  $scope.addContact = function addContact() {
    $scope.resetAction();
    if ($scope.model.attachOrganization2010) {
      $scope.model.newAccount.organization2010 =
        $scope.model.attachOrganization2010.name;
    }

    EmailProExternalContacts.addContact(
      $stateParams.organization,
      $stateParams.productId,
      $scope.model.newAccount,
    )
      .then(() => {
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_add_success',
          ),
          { status: 'success' },
        );
      })
      .catch((failure) => {
        set(failure, 'status', 'error');
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_add_fail',
          ),
          failure,
        );
      });
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
    return EmailProExternalContacts.isAccountValid($scope.model.newAccount);
  };
};
