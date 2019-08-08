angular
  .module('App')
  .controller(
    'HostingOrderCdnCtrl',
    ($scope, $q, $translate, $window, HostingOptionOrder, Hosting, Alerter, $rootScope) => {
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
      const hosting = $scope.currentActionData;

      $scope.isOrderable = false;
      $scope.availableOffers = [];
      $scope.durations = [];
      $scope.details = {};

      $scope.loadOrder = () => {
        $scope.loading.init = true;
        HostingOptionOrder.isOptionOrderable('cdn').then((isOrderable) => {
          if (isOrderable) {
            $scope.isOrderable = true;
          }
          $scope.loading.model = true;
          HostingOptionOrder.getOrderEnums('hosting.web.CdnOfferEnum').then((models) => {
            if (!$scope.isPerfOffer() && !$scope.hosting.isCloudWeb) {
              $scope.availableOffers = models.filter(offer => offer !== 'CDN_BUSINESS_FREE');
            } else {
              $scope.availableOffers = ['CDN_BUSINESS_FREE'];
            }

            [$scope.model.offer] = $scope.availableOffers;
            $scope.loading.model = false;
            $scope.loading.init = false;

            if ($scope.availableOffers.length === 1) {
              $rootScope.$broadcast('wizard-goToStep', 3);
              $scope.getDuration();
            }
          });
        });
      };

      $scope.isPerfOffer = () => Hosting.constructor.isPerfOffer((hosting
        || $scope.hostingProxy).offer);

      $scope.getDuration = () => {
        const queue = [];
        $scope.loading.duration = true;

        HostingOptionOrder.getOrderDurations('cdn', {
          offer: $scope.model.offer,
        })
          .then((durations) => {
            $scope.durations = durations;

            if ($scope.durations.length === 1) {
              [$scope.model.duration] = $scope.durations;
            }

            $scope.loading.details = true;
            angular.forEach($scope.durations, (duration) => {
              queue.push(HostingOptionOrder.getOrderDetailsForDuration('cdn', duration, {
                offer: $scope.model.offer,
              }).then((details) => {
                $scope.details[duration] = details;
              }));
            });
            $q.all(queue).then(() => {
              $scope.loading.details = false;
            });
            $scope.loading.duration = false;
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_dashboard_cdn_order_error'),
              _.get(err, 'data', err),
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
              $scope.model.offer
              && $scope.model.duration
              && !$scope.loading.details
            );
          case 3:
            return (
              $scope.model.offer
              && $scope.model.duration
              && $scope.model.contract
            );
          default:
            return null;
        }
      };

      $scope.makeOrder = () => {
        $scope.loading.order = true;
        HostingOptionOrder.makeOrder('cdn', $scope.model.duration, {
          offer: $scope.model.offer,
        })
          .then((order) => {
            Alerter.success(
              $translate.instant('hosting_dashboard_cdn_order_success', { t0: order.url }),
              $scope.alerts.main,
            );
            $window.open(order.url, '_blank');
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_dashboard_cdn_order_error'),
              _.get(err, 'data', err),
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.resetAction();
          });
      };
    },
  );
