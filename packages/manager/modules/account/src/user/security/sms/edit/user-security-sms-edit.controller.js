import get from 'lodash/get';

export default [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.doubleAuth.sms',
  'Alerter',
  function UserAccountDoubleAuthSmsEditController(
    $rootScope,
    $scope,
    $translate,
    DoubleAuthSmsService,
    Alerter,
  ) {
    $scope.sms = {
      smsAccount: get($scope, 'currentActionData', {}),
      description: get($scope, 'currentActionData.description', ''),
      isEditing: false,
    };

    /* ===============================
    =            HELPERS            =
    =============================== */

    /**
     * Check if step is valid.
     * @return {Boolean}
     */
    $scope.doesStepIsValid = () =>
      !angular.equals(
        $scope.sms.smsAccount.description,
        $scope.sms.description,
      ) &&
      this.userAccountEditSmsDescriptionForm &&
      this.userAccountEditSmsDescriptionForm.description.$valid;

    /* -----  End of HELPERS  ------ */

    /* ===============================
    =            ACTIONS            =
    =============================== */

    /**
     * Edit double auth SMS account.
     * @return {Promise}
     */
    $scope.editDoubleAuthSms = () => {
      $scope.sms.isEditing = true;
      return DoubleAuthSmsService.edit(
        $scope.sms.smsAccount.id,
        $scope.sms.description,
      )
        .then(() => {
          Alerter.success(
            $translate.instant(
              'user_account_security_double_auth_type_sms_edit_success',
              'doubleAuthAlertSms',
            ),
          );
          $rootScope.$broadcast('doubleAuthSMS.reload');
        })
        .catch((err) =>
          Alerter.alertFromSWS(
            $translate.instant(
              'user_account_security_double_auth_type_sms_edit_error',
            ),
            err,
            'doubleAuthAlertSms',
          ),
        )
        .finally(() => {
          $scope.sms.isEditing = false;
          $scope.resetAction();
        });
    };

    /**
     * Cancel SMS edit modal.
     */
    $scope.cancel = () => $scope.resetAction();

    /* -----  End of ACTIONS  ------ */
  },
];
