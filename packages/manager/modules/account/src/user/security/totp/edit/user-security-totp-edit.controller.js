import get from 'lodash/get';

export default [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.doubleAuth.totp',
  'Alerter',
  function UserAccountDoubleAuthTotpEditController(
    $rootScope,
    $scope,
    $translate,
    DoubleAuthTotpService,
    Alerter,
  ) {
    $scope.totp = {
      totpAccount: get($scope, 'currentActionData', {}),
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
        $scope.totp.totpAccount.description,
        $scope.totp.description,
      ) &&
      this.userAccountEditTotpDescriptionForm &&
      this.userAccountEditTotpDescriptionForm.$valid;

    /* -----  End of HELPERS  ------ */

    /* ===============================
    =            ACTIONS            =
    =============================== */

    /**
     * Edit double auth TOTP account.
     * @return {Promise}
     */
    $scope.editDoubleAuthTotp = () => {
      $scope.totp.isEditing = true;
      return DoubleAuthTotpService.edit(
        $scope.totp.totpAccount.id,
        $scope.totp.description,
      )
        .then(() => {
          Alerter.success($translate.instant('', 'doubleAuthAlertTotp'));
          $rootScope.$broadcast('doubleAuthTOTP.reload');
        })
        .catch((err) =>
          Alerter.alertFromSWS(
            $translate.instant('user_security_double_auth_totp_edit_error'),
            err.data,
            'doubleAuthAlertTotp',
          ),
        )
        .finally(() => {
          $scope.totp.isEditing = false;
          $scope.resetAction();
        });
    };

    /**
     * Cancel TOTP edit modal.
     */
    $scope.cancel = () => $scope.resetAction();

    /* -----  End of ACTIONS  ------ */
  },
];
