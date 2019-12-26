import get from 'lodash/get';

angular
  .module('App')
  .controller(
    'HostingBoostOfferUpdateCtrl',
    ($scope, $translate, HostingBoost, Alerter) => {
      $scope.product = $scope.currentActionData.product;
      $scope.models = { boostOffer: null };
      $scope.acceptCGV = { value: false };

      $scope.loaders = {
        request: false,
      };

      $scope.isStepValid = () =>
        $scope.acceptCGV.value === true &&
        angular.isObject($scope.models.boostOffer);

      $scope.updateBoost = () => {
        $scope.loaders.request = true;

        HostingBoost.requestBoost({
          serviceName: $scope.product.serviceName,
          offer: $scope.models.boostOffer.offer,
        })
          .then(() => {
            Alerter.success(
              $translate.instant('hosting_tab_BOOST_update_activation'),
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_BOOST_update_error'),
              get(err, 'data', err),
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.loaders.request = false;
            $scope.resetAction();
          });
      };
    },
  );
