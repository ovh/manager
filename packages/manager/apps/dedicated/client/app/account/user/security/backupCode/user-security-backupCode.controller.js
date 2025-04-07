export default [
  '$scope',
  '$translate',
  'UserAccount.services.doubleAuth.backupCode',
  'Alerter',
  function UserAccountDoubleAuthBackupCodeController(
    $scope,
    $translate,
    DoubleAuthBackupCodeService,
    Alerter,
  ) {
    $scope.backupCode = {
      sotpAccount: null,
      isLoading: false,
    };

    /* ===============================
        =            HELPERS            =
        =============================== */

    /**
     * Fetch backupCode sotp account.
     * @return {Promise}
     */
    function fetchBackupCodeSotpAccount() {
      return DoubleAuthBackupCodeService.get();
    }

    /* -----  End of HELPERS  ------ */

    /* ==============================
        =            EVENTS            =
        ============================== */

    $scope.$on('doubleAuthBackupCode.reload', $scope.init);

    /* -----  End of EVENTS  ----- */

    /* ======================================
        =            INITIALIZATION            =
        ====================================== */

    /**
     * Init.
     * @return {Promise}
     */
    $scope.init = () => {
      $scope.backupCode.isLoading = true;
      return fetchBackupCodeSotpAccount()
        .then((sotpAccount) => {
          $scope.backupCode.sotpAccount = sotpAccount;
        })
        .catch((err) => {
          if (err.status !== 404) {
            Alerter.alertFromSWS(
              $translate.instant(
                'user_account_security_double_auth_type_backup_code_error',
              ),
              err.data,
              'doubleAuthAlert',
            );
          }
          $scope.backupCode.status = null;
        })
        .finally(() => {
          $scope.backupCode.isLoading = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */
  },
];
