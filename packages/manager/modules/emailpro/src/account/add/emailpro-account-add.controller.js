import angular from 'angular';
import head from 'lodash/head';
import includes from 'lodash/includes';
import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro, EmailProPassword) => {
  $scope.valid = { legalWarning: false };
  $scope.accountTypeHosted = EmailPro.accountTypeHosted;

  $scope.passwordTooltip = null;

  $scope.setPasswordsFlag = function setPasswordsFlag(selectedAccount) {
    $scope.differentPasswordFlag = false;
    $scope.simplePasswordFlag = false;
    $scope.containsNameFlag = false;
    $scope.containsSameAccountNameFlag = false;
    $scope.containsSpace = false;

    set(selectedAccount, 'password', selectedAccount.password || '');
    set(selectedAccount, 'passwordConfirmation', selectedAccount.passwordConfirmation || '');

    if (selectedAccount.password.length > 0) {
      $scope.simplePasswordFlag = !EmailProPassword.passwordSimpleCheck(
        selectedAccount.password,
        true,
        $scope.newAccountOptions.minPasswordLength,
      );

      if (!$scope.simplePasswordFlag
          && selectedAccount.password !== selectedAccount.passwordConfirmation) {
        $scope.differentPasswordFlag = true;
      }

      $scope.containsSpace = includes(selectedAccount.password, ' ');

      /*
        see the password complexity requirements of Microsoft Windows Server (like EmailPro)
        https://technet.microsoft.com/en-us/library/hh994562%28v=ws.10%29.aspx
       */
      if ($scope.newAccountOptions.passwordComplexityEnabled) {
        $scope.simplePasswordFlag = $scope.simplePasswordFlag
          || !EmailProPassword.passwordComplexityCheck(selectedAccount.password);

        if (selectedAccount.displayName) {
          $scope.containsNameFlag = EmailProPassword.passwordContainsName(
            selectedAccount.password,
            selectedAccount.displayName,
          );
        }

        if (!$scope.containsNameFlag && selectedAccount.login) {
          if (selectedAccount.password.indexOf(selectedAccount.login) !== -1) {
            $scope.containsNameFlag = true;
          }
        }

        if (selectedAccount.samaccountName
          && selectedAccount.password.indexOf(selectedAccount.samaccountName) !== -1) {
          if (!$scope.containsSamAccountNameLabel) {
            $scope.containsSamAccountNameLabel = $translate.instant(
              'emailpro_ACTION_update_account_step1_password_contains_samaccount_name',
              { t0: selectedAccount.samaccountName },
            );
          }
          $scope.containsSamAccountNameFlag = true;
        } else {
          $scope.containsSamAccountNameFlag = false;
        }
      }
    }
  };

  $scope.accountToAdd = {
    outlook: false,
    hiddenFromGAL: false,
  };

  $scope.getPasswordTooltip = function getPasswordTooltip() {
    if ($scope.newAccountOptions) {
      return $scope.newAccountOptions.passwordComplexityEnabled
        ? $translate.instant('emailpro_ACTION_update_account_step1_complex_password_tooltip', { t0: $scope.newAccountOptions.minPasswordLength })
        : $translate.instant('emailpro_ACTION_update_account_step1_simple_password_tooltip', { t0: $scope.newAccountOptions.minPasswordLength });
    }
    return null;
  };

  $scope.checkTakenEmails = function checkTakenEmails() {
    $scope.takenEmailError = false;

    if ($scope.takenEmails && $scope.accountToAdd.login) {
      angular.forEach($scope.takenEmails, (value) => {
        if (`${$scope.accountToAdd.login.toLowerCase()}@${$scope.accountToAdd.completeDomain.name}` === value.toLowerCase()) {
          $scope.takenEmailError = true;
        }
      });
    }
  };

  $scope.loadAccountOptions = function loadAccountOptions() {
    EmailPro.getNewAccountOptions($stateParams.productId).then((data) => {
      $scope.newAccountOptions = data;
      $scope.takenEmails = data.takenEmails;

      if (data.availableDomains.length === 0) {
        $scope.setMessage($translate.instant('emailpro_ACTION_add_no_domains'), { status: 'error' });
        $scope.resetAction();
      } else {
        $scope.accountToAdd.completeDomain = head(data.availableDomains);
        $scope.accountToAdd.accountLicense = head(data.availableTypes);
        $scope.accountIsValid();
      }

      $scope.passwordTooltip = $scope.newAccountOptions.passwordComplexityEnabled
        ? $translate.instant(
          'emailpro_ACTION_update_account_step1_complex_password_tooltip',
          { t0: $scope.newAccountOptions.minPasswordLength },
        )
        : $translate.instant(
          'emailpro_ACTION_update_account_step1_simple_password_tooltip',
          { t0: $scope.newAccountOptions.minPasswordLength },
        );
    }, (failure) => {
      $scope.resetAction();
      $scope.setMessage($translate.instant('emailpro_ACTION_add_account_option_fail'), failure.data);
    });
  };

  $scope.accountIsValid = function accountIsValid() {
    // $scope.setPasswordsFlag($scope.accountToAdd);
    if (!$scope.valid.legalWarning) {
      return false;
    } if ($scope.containsSpace
       || $scope.simplePasswordFlag
       || $scope.differentPasswordFlag
       || $scope.containsNameFlag) {
      return false;
    } if (!$scope.accountToAdd.completeDomain
      || $scope.accountToAdd.completeDomain.name === undefined) {
      return false;
    } if (!$scope.accountToAdd.login) {
      return false;
    } if (!$scope.accountToAdd.password
      || $scope.accountToAdd.password.indexOf(' ') > -1
      || $scope.accountToAdd.password !== $scope.accountToAdd.passwordConfirmation) {
      return false;
    }
    return EmailProPassword.passwordSimpleCheck(
      $scope.accountToAdd.password,
      false,
      $scope.newAccountOptions.minPasswordLength,
    );
  };

  $scope.addEmailProAccount = function addEmailProAccount() {
    // cleanup the model
    $scope.accountToAdd.domain = $scope.accountToAdd.completeDomain.name;
    $scope.accountToAdd.completeDomain = undefined;
    $scope.accountToAdd.login = $scope.accountToAdd.login.toLowerCase();

    EmailPro.addEmailProAccount($stateParams.productId, $scope.accountToAdd).then(() => {
      $scope.setMessage($translate.instant('emailpro_ACTION_add_account_success_message'), { status: 'success' });
    }, (failure) => {
      $scope.setMessage($translate.instant('emailpro_ACTION_add_account_error_message'), failure.data);
    });
    $scope.resetAction();
  };
};
