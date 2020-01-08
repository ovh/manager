import forEach from 'lodash/forEach';

angular
  .module('App')
  .controller(
    'HostingDatabaseOrderCtrl',
    ($scope, $q, $translate, $window, HostingOptionOrder, Alerter) => {
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

      $scope.isOrderable = false;
      $scope.availableOffers = [];
      $scope.durations = [];
      $scope.details = {};

      $scope.loadOrder = () => {
        $scope.loading.init = true;
        HostingOptionOrder.isOptionOrderable('extraSqlPerso')
          .then((isOrderable) => {
            if (isOrderable) {
              $scope.isOrderable = true;
            }
            $scope.loading.model = true;
            HostingOptionOrder.getOrderEnums(
              'hosting.web.database.SqlPersoOfferEnum',
            )
              .then((models) => {
                $scope.availableOffers = models;
              })
              .finally(() => {
                $scope.loading.model = false;
              });
          })
          .finally(() => {
            $scope.loading.init = false;
          });
      };

      $scope.getDuration = () => {
        const queue = [];
        $scope.loading.duration = true;
        HostingOptionOrder.getOrderDurations('extraSqlPerso', {
          offer: $scope.model.offer,
        }).then((durations) => {
          $scope.durations = durations;

          if ($scope.durations.length === 1) {
            [$scope.model.duration] = $scope.durations;
          }

          $scope.loading.details = true;
          forEach($scope.durations, (duration) => {
            queue.push(
              HostingOptionOrder.getOrderDetailsForDuration(
                'extraSqlPerso',
                duration,
                { offer: $scope.model.offer },
              ).then((details) => {
                $scope.details[duration] = details;
              }),
            );
          });
          $q.all(queue).then(() => {
            $scope.loading.details = false;
          });
          $scope.loading.duration = false;
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
            return false;
        }
      };

      $scope.orderDatabase = () => {
        $scope.loading.order = true;
        HostingOptionOrder.makeOrder('extraSqlPerso', $scope.model.duration, {
          offer: $scope.model.offer,
        }).then((order) => {
          $scope.resetAction();
          Alerter.success(
            $translate.instant(
              'hosting_tab_DATABASES_configuration_order_success',
              {
                t0: order.url,
                t1: order.orderId,
              },
            ),
            $scope.alerts.main,
          );
          $window.open(order.url, '_blank');
        });
      };
    },
  );
