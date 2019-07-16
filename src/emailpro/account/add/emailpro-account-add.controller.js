angular.module('Module.emailpro.controllers')
  .controller('EmailProAddAccountCtrl', ($scope, $stateParams, $translate, EmailPro, EmailProPassword) => {
    $scope.valid = { legalWarning: false };
    $scope.accountTypeHosted = EmailPro.accountTypeHosted;

    $scope.passwordTooltip = null;

    $scope.setPasswordsFlag = function (selectedAccount) {
      $scope.differentPasswordFlag = false;
      $scope.simplePasswordFlag = false;
      $scope.containsNameFlag = false;
      $scope.containsSameAccountNameFlag = false;

      _.set(selectedAccount, 'password', selectedAccount.password || '');
      _.set(selectedAccount, 'passwordConfirmation', selectedAccount.passwordConfirmation || '');

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

    $scope.getPasswordTooltip = function () {
      if ($scope.newAccountOptions) {
        return $scope.newAccountOptions.passwordComplexityEnabled
          ? $translate.instant('emailpro_ACTION_update_account_step1_complex_password_tooltip', { t0: $scope.newAccountOptions.minPasswordLength })
          : $translate.instant('emailpro_ACTION_update_account_step1_simple_password_tooltip', { t0: $scope.newAccountOptions.minPasswordLength });
      }
      return null;
    };

    $scope.checkTakenEmails = function () {
      $scope.takenEmailError = false;

      if ($scope.takenEmails && $scope.accountToAdd.login) {
        angular.forEach($scope.takenEmails, (value) => {
          if (`${$scope.accountToAdd.login.toLowerCase()}@${$scope.accountToAdd.completeDomain.name}` === value.toLowerCase()) {
            $scope.takenEmailError = true;
          }
        });
      }
    };

    $scope.loadAccountOptions = function () {
      EmailPro.getNewAccountOptions($stateParams.productId).then((data) => {
        $scope.newAccountOptions = data;
        $scope.takenEmails = data.takenEmails;

        if (data.availableDomains.length === 0) {
          $scope.setMessage($translate.instant('emailpro_ACTION_add_no_domains'), { status: 'error' });
          $scope.resetAction();
        } else {
          $scope.accountToAdd.completeDomain = _.first(data.availableDomains);
          $scope.accountToAdd.accountLicense = _.first(data.availableTypes);
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

    $scope.accountIsValid = function () {
      // $scope.setPasswordsFlag($scope.accountToAdd);
      if (!$scope.valid.legalWarning) {
        return false;
      } if ($scope.simplePasswordFlag || $scope.differentPasswordFlag || $scope.containsNameFlag) {
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

    $scope.addEmailProAccount = function () {
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
  });

angular.module('Module.emailpro.controllers')
  .controller('EmailProOrderAccountCtrl', ($scope, $stateParams, $translate, EmailPro, User) => {
    // default values
    $scope.accountsToAdd = {
      duration: '12',
      accountsNumber: 1,
    };

    User.getUser()
      .then(({ ovhSubsidiary }) => {
        $scope.ovhSubsidiary = ovhSubsidiary;
      })
      .catch((failure) => {
        $scope.setMessage($translate.instant('emailpro_ACTION_order_accounts_step1_user_error'), failure.data);
        $scope.ovhSubsidiary = 'FR';
      })
      .then(() => {
        $scope.showPriceWithTaxOnly = _.includes(['DE'], $scope.ovhSubsidiary);
      });

    $scope.valid = { legalWarning: false };
    if ($scope.worldPart === 'CA') {
      $scope.valid.legalWarning = true;
    }
    $scope.ordersList = null;
    $scope.url = null;
    $scope.previewOrder = null;

    $scope.order = function () {
      $scope.url = null;
      $scope.previewOrder = null;
      EmailPro.orderAccounts($stateParams.productId, $scope.accountsToAdd).then((data) => {
        $scope.previewOrder = data;
        $scope.url = data.url;
      }, (failure) => {
        $scope.setMessage($translate.instant('emailpro_ACTION_order_accounts_step2_error_message'), failure.data);
        $scope.resetAction();
      });
    };

    $scope.loadOrderList = function () {
      EmailPro.getOrderList($stateParams.productId).then((data) => {
        $scope.ordersList = _.map(data, (datum) => {
          const orderAvailable = _.cloneDeep(datum);
          orderAvailable.unitaryMonthlyPriceWithTaxes.localizedText = EmailPro.getLocalizedPrice(
            $scope.ovhSubsidiary,
            parseFloat(orderAvailable.duration.duration)
              * orderAvailable.unitaryMonthlyPriceWithTaxes.value,
            orderAvailable.unitaryMonthlyPriceWithTaxes.currencyCode,
          );
          return orderAvailable;
        });
      }, (failure) => {
        $scope.setMessage($translate.instant('emailpro_ACTION_order_accounts_step1_loading_error'), failure.data);
        $scope.resetAction();
      });
    };

    $scope.getSelectedPaymentPrice = function () {
      if ($scope.ordersList) {
        const selected = $.grep(
          $scope.ordersList,
          e => $scope.accountsToAdd.duration === e.duration.duration,
        );
        return selected ? selected[0] : null;
      }
      return null;
    };

    $scope.isValid = function () {
      return $scope.ordersList && $scope.accountsToAdd.accountsNumber && $scope.valid.legalWarning;
    };

    $scope.addEmailProAccount = function () {
      $scope.resetAction();
      window.open(
        $scope.url,
        '_blank',
      );
    };
  });
