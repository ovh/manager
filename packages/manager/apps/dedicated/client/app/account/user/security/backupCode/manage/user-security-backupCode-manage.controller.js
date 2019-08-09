angular.module('UserAccount').controller('UserAccount.controllers.doubleAuth.backupCode.manage', [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.doubleAuth.backupCode',
  'Alerter',
  function ($rootScope, $scope, $translate, DoubleAuthBackupCodeService, Alerter) {
    $scope.backupCode = {
      sotpAccount: _.get($scope, 'currentActionData', {}),
      codes: null,
      code: '',
      isGenerating: false,
      isValidating: false,
      isGenerated: false,
    };

    /* ===============================
        =            ACTIONS            =
        =============================== */

    /**
         * Validate backupCode.
         * @return {Promise}
         */
    $scope.validateBackupCode = () => {
      $scope.backupCode.isValidating = true;
      return DoubleAuthBackupCodeService.validate(_.first($scope.backupCode.codes))
        .then(() => Alerter.success($translate.instant('user_account_security_double_auth_type_backup_code_validate_success'), 'doubleAuthAlertBackupCode'))
        .catch(err => Alerter.alertFromSWS($translate.instant('user_account_security_double_auth_type_backup_code_validate_error'), err.data, 'doubleAuthAlertBackupCode'))
        .finally(() => {
          $scope.backupCode.isValidating = false;
          $rootScope.$broadcast('doubleAuthBackupCode.reload');
          $scope.resetAction();
        });
    };

    /**
         * Cancel backupCode manage modal.
         */
    $scope.cancel = () => $scope.resetAction();

    /* -----  End of ACTIONS  ------ */

    /* ======================================
        =            INITIALIZATION            =
        ====================================== */

    /**
         * Generate backupCode.
         * @return {Promise}
         */
    $scope.generateBackupCode = () => {
      $scope.backupCode.isGenerating = true;
      return DoubleAuthBackupCodeService.post()
        .then((sotpAccount) => {
          $scope.backupCode.codes = _.get(sotpAccount, 'codes', []);
          $scope.backupCode.isGenerated = true;
          return sotpAccount;
        })
        .catch(err => Alerter.alertFromSWS($translate.instant('user_account_security_double_auth_type_backup_code_generate_error'), err.data, 'doubleAuthAlertBackupCode'))
        .finally(() => {
          $scope.backupCode.isGenerating = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */
  },
]);
