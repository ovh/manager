import get from 'lodash/get';

angular
  .module('App')
  .controller(
    'HostingBoostOfferRequestCtrl',
    ($scope, $translate, HostingBoost, Alerter, WucUser) => {
      $scope.product = $scope.currentActionData.product;
      $scope.models = { boostOffer: null };
      $scope.acceptCGV = { value: false };

      $scope.loaders = {
        request: false,
      };

      WucUser.getUser().then((user) => {
        HostingBoost.getBoostPrice(user.ovhSubsidiary).then((catalog) => {
          const addon = catalog.addons.find(
            ({ planCode }) => planCode === 'consumption-perf2014',
          );

          $scope.models.boostDailyPrice = addon.pricings[0].price / 100000000;
          $scope.models.boostDailyPrice += ` ${catalog.locale.currencyCode}`;
        });
      });

      $scope.isStepValid = () =>
        $scope.acceptCGV.value === true &&
        angular.isObject($scope.models.boostOffer);

      $scope.requestBoost = () => {
        $scope.loaders.request = true;

        HostingBoost.requestBoost({
          serviceName: $scope.product.serviceName,
          offer: $scope.models.boostOffer.offer,
        })
          .then(() => {
            Alerter.success(
              $translate.instant('hosting_tab_BOOST_request_activation'),
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_BOOST_request_error'),
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
