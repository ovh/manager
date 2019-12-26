angular
  .module('App')
  .controller(
    'DedicatedCloudUserResetPasswordCtrl',
    ($stateParams, $scope, $translate, DedicatedCloud, Alerter) => {
      $scope.canBeResetHere = false;
      $scope.resetUrl = '';

      $scope.user = $scope.currentActionData
        ? $scope.currentActionData.user
        : null;
      $scope.passwordPolicy = $scope.currentActionData
        ? $scope.currentActionData.passwordPolicy
        : null;
      $scope.password = '';
      $scope.user.confirmPassword = $scope.user.confirmPassword
        ? $scope.user.confirmPassword
        : '';

      $scope.showError = {
        checkPassword: false,
      };
      $scope.loading = false;

      $scope.resetPassword = function resetPassword() {
        $scope.isReseting = true;
        return DedicatedCloud.resetUserPassword(
          $stateParams.productId,
          $scope.user,
          $scope.user.password,
        )
          .then(() => {
            $scope.setMessage(
              $translate.instant('dedicatedCloud_users_password_loading_done'),
              true,
            );
          })
          .catch((err) => {
            $scope.setMessage(
              $translate.instant('dedicatedCloud_users_password_loading_error'),
              err,
            );
          })
          .finally(() => {
            $scope.isReseting = false;
            $scope.resetAction();
          });
      };

      $scope.checkPassword = function checkPassword(data) {
        $scope.user.password = data;
        $scope.showError.checkPassword = false;

        return DedicatedCloud.checkPassword($scope.passwordPolicy, $scope.user);
      };

      function getSelectedProduct() {
        return DedicatedCloud.getDescription($stateParams.productId).then(
          (productDescription) => {
            $scope.resetUrl = productDescription.vScopeUrl.replace(
              'vScope',
              'secure',
            );
          },
        );
      }

      $scope.checkOptionsStates = function checkOptionsStates() {
        $scope.loading = true;
        return DedicatedCloud.hasSecurityOption($stateParams.productId)
          .then((hasSecurityOption) => {
            $scope.canBeResetHere = !hasSecurityOption;
            if (hasSecurityOption) {
              return getSelectedProduct();
            }
            return null;
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'dedicatedCloud_users_password_reset_check_error',
              ),
              err,
            );
          })
          .finally(() => {
            $scope.loading = false;
          });
      };
    },
  );
