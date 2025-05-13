export default /* @ngInject */ function UserAccountDoubleAuthPasswordController(
  $scope,
  $translate,
  Alerter,
  atInternet,
  OvhApiAuth,
  OvhApiMe,
  userAccountServiceInfos,
) {
  $scope.loaders = {
    loading: false,
  };

  /* ===============================
        =            ACTIONS            =
        =============================== */

  /**
   * Load user infos.
   * @return {Promise}
   */
  $scope.loadUserInfos = () => {
    $scope.loaders.loading = true;
    return OvhApiAuth.v6()
      .details()
      .$promise.then((authDetails) => {
        if (authDetails.user) {
          return OvhApiMe.Identity()
            .User()
            .v6()
            .get({
              user: authDetails.user,
            })
            .$promise.then((user) => {
              $scope.user = user;
            });
        }
        return userAccountServiceInfos.getUseraccountInfos().then((user) => {
          $scope.user = user;
        });
      })
      .catch((err) =>
        Alerter.alertFromSWS(
          $translate.instant('user_account_changepassword_fail'),
          err.data,
          'useraccount.alerts.dashboardInfos',
        ),
      )
      .finally(() => {
        $scope.loaders.loading = false;
      });
  };

  /**
   * Change password.
   * @return {Promise}
   */
  $scope.changePassword = () => {
    $scope.loaders.loading = true;
    return userAccountServiceInfos
      .changePassword()
      .then(() =>
        Alerter.alertFromSWS(
          $translate.instant('user_account_changepassword_success'),
          'useraccount.alerts.dashboardInfos',
        ),
      )
      .catch((err) =>
        Alerter.alertFromSWS(
          $translate.instant('user_account_changepassword_fail'),
          err.data,
          'useraccount.alerts.dashboardInfos',
        ),
      )
      .finally(() => {
        $scope.loaders.loading = false;
        $scope.resetAction();

        atInternet.trackClick({
          name: 'validation_password_edit',
          type: 'action',
          chapter1: 'account',
          chapter2: 'security',
          chapter3: 'edit',
        });
      });
  };

  /* -----  End of ACTIONS  ------ */
}
