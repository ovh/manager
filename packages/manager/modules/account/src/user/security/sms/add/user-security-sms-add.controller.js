import isEmpty from 'lodash/isEmpty';

export default [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.doubleAuth.sms',
  'Alerter',
  function UserAccountDoubleAuthSmsAddController(
    $rootScope,
    $scope,
    $translate,
    DoubleAuthSmsService,
    Alerter,
  ) {
    $scope.sms = {
      phone: null,
      code: null,
      secret: null,
      description: null,
      isGeneratingSecret: false,
      isAdding: false,
    };

    /* ===============================
    =            HELPERS            =
    =============================== */

    /**
     * Check if step 1 is valid.
     * @return {Boolean}
     */
    $scope.doesStep1IsValid = () => !isEmpty($scope.sms.phone);

    /**
     * Check if step 2 is valid.
     * @return {Boolean}
     */
    $scope.doesStep2IsValid = () =>
      angular.isObject($scope.sms.secret) &&
      this.userAccountAddSmsCodeForm &&
      this.userAccountAddSmsCodeForm.$valid;

    /* -----  End of HELPERS  ------ */

    /* ===============================
    =            ACTIONS            =
    =============================== */

    /**
     * Get code.
     * @return {Promise}
     */
    $scope.getCode = () => {
      $scope.sms.isGeneratingSecret = true;
      return DoubleAuthSmsService.post($scope.sms.phone)
        .then((smsSecret) => {
          $scope.sms.secret = smsSecret;
          return smsSecret;
        })
        .catch((err) => {
          Alerter.alertFromSWS(
            $translate.instant(
              'user_account_security_double_auth_type_sms_error_add',
            ),
            err,
            'doubleAuthAlertSms',
          );
          $scope.resetAction();
        })
        .finally(() => {
          $scope.sms.isGeneratingSecret = false;
        });
    };

    /**
     * Add double auth SMS account.
     * @return {Promise}
     */
    $scope.addDoubleAuthSms = () => {
      $scope.sms.isAdding = true;
      return DoubleAuthSmsService.validate(
        $scope.sms.secret.id,
        $scope.sms.code,
      )
        .then(() => {
          if (!isEmpty($scope.sms.description)) {
            DoubleAuthSmsService.edit(
              $scope.sms.secret.id,
              $scope.sms.description,
            );
          }
        })
        .then(() => {
          $rootScope.$broadcast('doubleAuthSMS.reload');
          $scope.resetAction();
        })
        .catch((err) => {
          Alerter.alertFromSWS(
            $translate.instant(
              'user_account_security_double_auth_type_sms_error_validate',
            ),
            err,
            'doubleAuthAlertSmsAdd',
          );
        })
        .finally(() => {
          $scope.sms.isAdding = false;
        });
    };

    /**
     * Cancel SMS add modal.
     */
    $scope.cancel = () => $scope.resetAction();

    /* -----  End of ACTIONS  ------ */
  },
];
