import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

angular
  .module('App')
  .controller(
    'HostingOrderBandwidthCtrl',
    (
      $scope,
      $q,
      $window,
      $stateParams,
      $translate,
      HostingBandwidthOrder,
      Alerter,
    ) => {
      $scope.loading = {
        init: true,
        duration: true,
        model: false,
        details: false,
        order: false,
      };

      $scope.model = {
        offer: null,
        duration: null,
        contract: null,
      };

      $scope.isOrderable = true;
      $scope.availableOffers = [];
      $scope.durations = [];
      $scope.details = {};

      $scope.loadOrder = () => {
        $scope.loading.init = true;
        HostingBandwidthOrder.getModels()
          .then((models) => {
            $scope.trafficEnum = sortBy(
              models.models['hosting.web.BandwidthOfferEnum'].enum,
              (d) => parseInt(d, 10),
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_dashboard_bandwidth_order_error'),
              err,
              $scope.alerts.main,
            );
            $scope.resetAction();
          })
          .finally(() => {
            $scope.loading.init = false;
          });
      };

      $scope.getDuration = () => {
        const queue = [];
        $scope.loading.duration = true;
        HostingBandwidthOrder.getDurations($stateParams.productId, {
          traffic: $scope.model.offer,
        })
          .then((durations) => {
            $scope.durations = durations;

            if ($scope.durations.length === 1) {
              [$scope.model.duration] = $scope.durations;
            }

            $scope.loading.details = true;
            $scope.durations.forEach((duration) => {
              queue.push(
                HostingBandwidthOrder.getOrder($stateParams.productId, {
                  traffic: $scope.model.offer,
                  duration,
                }).then((details) => {
                  $scope.details[duration] = details;
                }),
              );
            });
            $q.all(queue).then(() => {
              $scope.loading.details = false;
            });
            $scope.loading.duration = false;
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_dashboard_bandwidth_order_error'),
              err,
              $scope.alerts.main,
            );
            $scope.resetAction();
          });
      };

      $scope.isStepValid = (step) => {
        switch (step) {
          case 1:
            return (
              !$scope.loading.init && $scope.isOrderable && $scope.model.offer
            );
          case 2:
            return (
              $scope.model.offer &&
              $scope.model.duration &&
              !$scope.loading.details
            );
          case 3:
            return (
              $scope.model.offer &&
              $scope.model.duration &&
              $scope.model.contract
            );
          default:
            return null;
        }
      };

      $scope.makeOrder = () => {
        $scope.loading.order = true;
        HostingBandwidthOrder.order($stateParams.productId, {
          traffic: $scope.model.offer,
          duration: $scope.model.duration,
        })
          .then((order) => {
            Alerter.success(
              $translate.instant('hosting_dashboard_cdn_order_success', {
                t0: order.url,
              }),
              $scope.alerts.main,
            );
            $window.open(order.url, '_blank');
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_dashboard_bandwidth_order_error'),
              get(err, 'data', err),
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.resetAction();
          });
      };
    },
  );
