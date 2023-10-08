import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export default [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.doubleAuth.u2f',
  'Alerter',
  function UserAccountDoubleAuthU2fAddController(
    $rootScope,
    $scope,
    $translate,
    DoubleAuthU2fService,
    Alerter,
  ) {
    $scope.u2f = {
      u2fAccount: get($scope, 'currentActionData', {}),
      registerChallenge: null,
      description: null,
      isAdding: false,
      hasError: false,
    };

    /* ===============================
    =            HELPERS            =
    =============================== */

    /**
     * Check if step is valid.
     * @return {Boolean}
     */
    $scope.doesStepIsValid = () =>
      !isEmpty($scope.u2f.registerChallenge) &&
      this.userAccountAddU2fDescriptionForm &&
      this.userAccountAddU2fDescriptionForm.$valid;

    /* -----  End of HELPERS  ------ */

    /* ===============================
    =            ACTIONS            =
    =============================== */

    /**
     * Add double auth U2F key.
     * @return {Promise}
     */
    $scope.addDoubleAuthU2fKey = () =>
      DoubleAuthU2fService.edit(
        $scope.u2f.registerChallenge.u2fId,
        $scope.u2f.description,
      ).then(() => {
        $rootScope.$broadcast('doubleAuthU2F.reload');
        $scope.resetAction();
      });

    /**
     * Cancel U2F add modal.
     */
    $scope.cancel = () => $scope.resetAction();

    /* -----  End of ACTIONS  ------ */

    /* ======================================
    =            INITIALIZATION            =
    ====================================== */

    /**
     * Init.
     * @return {Promise}
     */
    $scope.init = () => {
      $scope.u2f.isAdding = true;
      $scope.u2f.hasError = false;
      return DoubleAuthU2fService.post()
        .then((registerChallenge) => {
          $scope.u2f.registerChallenge = registerChallenge;
          $scope.u2f.description = get(
            registerChallenge,
            'key.description',
            '',
          );
        })
        .catch(() => {
          $scope.u2f.hasError = true;
          Alerter.error(
            $translate.instant(
              'user_account_security_double_auth_type_u2f_add_error',
            ),
            'doubleAuthAlertU2fAdd',
          );
        })
        .finally(() => {
          $scope.u2f.isAdding = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */
  },
];
