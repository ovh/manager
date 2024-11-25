import get from 'lodash/get';

export default [
  '$rootScope',
  '$scope',
  '$q',
  '$translate',
  'UserAccount.services.doubleAuth.u2f',
  'Alerter',
  function UserAccountDoubleAuthU2fDeleteController(
    $rootScope,
    $scope,
    $q,
    $translate,
    DoubleAuthU2fService,
    Alerter,
  ) {
    $scope.u2f = {
      u2fAccount: get($scope, 'currentActionData', {}),
    };

    /* ===============================
    =            HELPERS            =
    =============================== */

    $scope.doesStepIsValid = () => true;

    /* -----  End of HELPERS  ------ */

    /* ===============================
    =            ACTIONS            =
    =============================== */

    /**
     * Delete double auth U2F key.
     * @return {Promise}
     */
    $scope.deleteDoubleAuthU2fKey = () => {
      let promise = $q.when(true);
      if ($scope.u2f.u2fAccount.status === 'enabled') {
        promise = DoubleAuthU2fService.disable($scope.u2f.u2fAccount.id);
      }
      return promise
        .then(() => {
          return DoubleAuthU2fService.delete($scope.u2f.u2fAccount.id).then(
            () => {
              $rootScope.$broadcast('doubleAuthU2F.reload');
              $scope.resetAction();
            },
          );
        })
        .catch((err) => {
          Alerter.alertFromSWS(
            $translate.instant(
              'user_account_security_double_auth_type_u2f_delete_error',
            ),
            err.data,
            'doubleAuthAlertU2f',
          );
        });
    };

    /**
     * Cancel U2F delete modal.
     */
    $scope.cancel = () => $scope.resetAction();

    /* -----  End of ACTIONS  ------ */
  },
];
