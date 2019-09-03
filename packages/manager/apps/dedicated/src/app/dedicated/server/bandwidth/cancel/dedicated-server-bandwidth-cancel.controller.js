import set from 'lodash/set';

angular.module('App').controller('ServerCancelBandwidthCtrl', ($rootScope, $scope, $stateParams, $translate, Server, User, Alerter) => {
  $scope.loader = {
    loading: true,
  };

  $scope.cancelOption = function () {
    $scope.loader.loading = true;

    Server.cancelBandwidthOption($stateParams.productId)
      .then(() => {
        $scope.setMessage($translate.instant('server_cancel_bandwidth_cancel_success'), true);
        $rootScope.$broadcast('dedicated.informations.bandwidth');
      })
      .catch((data) => {
        set(data, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_cancel_bandwidth_cancel_error'), data);
      })
      .finally(() => {
        $scope.resetAction();
        $scope.loader.loading = false;
      });
  };

  function init() {
    $scope.loader.loading = true;
    User.getUser()
      .then((user) => {
        $scope.user = user;
      })
      .catch(() => {
        Alerter.alertFromSWS($translate.instant('server_cancel_bandwidth_confirmation_error'), { type: 'WARNING' }, 'cancelBandwidthConfirmationError');
      })
      .finally(() => {
        $scope.loader.loading = false;
      });
  }

  init();
});
