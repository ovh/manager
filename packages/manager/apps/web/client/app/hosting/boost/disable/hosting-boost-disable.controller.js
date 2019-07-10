angular
  .module('App')
  .controller(
    'HostingBoostOfferDisableCtrl',
    ($scope, $translate, HostingBoost, Alerter) => {
      $scope.product = $scope.currentActionData.product;
      $scope.acceptCGV = { value: false };

      $scope.loaders = {
        disable: false,
      };

      $scope.isStepValid = () => $scope.acceptCGV.value === true;

      $scope.disableBoost = () => {
        $scope.loaders.disable = true;

        HostingBoost.disableBoost({ serviceName: $scope.product.serviceName })
          .then(() => {
            Alerter.success(
              $translate.instant('hosting_tab_BOOST_disable_started'),
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_BOOST_disable_error'),
              _.get(err, 'data', err),
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.loaders.disable = false;
            $scope.resetAction();
          });
      };
    },
  );
