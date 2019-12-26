angular
  .module('Module.ip.controllers')
  .controller(
    'IplbOrderSslCtrl',
    ($scope, $rootScope, $translate, Iplb, Alerter, Validator) => {
      $scope.data = $scope.currentActionData; // service
      $scope.model = {};
      $scope.agree = {};
      $scope.order = {};

      $scope.loading = {
        init: true,
      };

      Iplb.isOptionOrderable($scope.data.value, 'ssl').then((isOrderable) => {
        $scope.isOrderable = !!isOrderable;
        $scope.loading.init = false;
      });

      $scope.$watch('model.domain', () => {
        $scope.helptext = $translate.instant('iplb_ssl_order_helptext', {
          t0: `postmaster@${
            $scope.isValid()
              ? $scope.model.domain
              : $translate.instant('iplb_ssl_order_helptext_domain')
          }`,
        });
      });

      $scope.isValid = function isValid() {
        return (
          $scope.model.domain && Validator.isValidDomain($scope.model.domain)
        );
      };

      $scope.backToContracts = function backToContracts() {
        if (!$scope.order.contracts || !$scope.order.contracts.length) {
          $rootScope.$broadcast('wizard-goToStep', 1);
        }
      };

      $scope.getResumePrice = function getResumePrice(price) {
        return price.value === 0
          ? $translate.instant('price_free')
          : $translate.instant('price_ht_label', { t0: price.text });
      };

      $scope.getOrder = function getOrder() {
        $scope.agree.value = false;
        $scope.loading.contracts = true;
        Iplb.getOrderSsl($scope.data.value, $scope.model.domain).then(
          (order) => {
            $scope.order = order;
            if (!$scope.order.contracts || !$scope.order.contracts.length) {
              $rootScope.$broadcast('wizard-goToStep', 4);
            }
            $scope.loading.contracts = false;
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('iplb_ssl_order_failure'),
              data,
            );
            $scope.resetAction();
          },
        );
      };

      $scope.confirmOrder = function confirmOrder() {
        $scope.loading.validation = true;
        Iplb.postOrderSsl($scope.data.value, $scope.model.domain)
          .then(
            (order) => {
              Alerter.success(
                $translate.instant('iplb_ssl_order_success', {
                  t0: order.url,
                  t1: order.orderId,
                }),
              );
              window.open(order.url, '_blank');
            },
            (data) => {
              Alerter.alertFromSWS(
                $translate.instant('iplb_ssl_order_failure'),
                data,
              );
            },
          )
          .finally(() => {
            $scope.resetAction();
          });
      };
    },
  );
