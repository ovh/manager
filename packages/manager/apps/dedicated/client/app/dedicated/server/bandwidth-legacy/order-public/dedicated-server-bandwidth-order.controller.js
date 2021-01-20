import head from 'lodash/head';
import sortBy from 'lodash/sortBy';

angular
  .module('App')
  .controller(
    'ServerOrderLegacyBandwidthCtrl',
    ($scope, $state, $stateParams, $translate, Alerter, Server, User) => {
      $scope.orderable = null;
      $scope.orderableBandwidth = {
        value: [],
      };

      $scope.selectedBandwidthTypes = {
        value: null,
      };

      $scope.selectedBandwidth = {
        value: null,
      };

      $scope.loaders = {
        orderableVersion: true,
        durations: false,
        bc: false,
      };

      /*
       *
       *  ORDERABLE
       *
       */
      $scope.getOrderableVersion = function getOrderableVersion() {
        $scope.loaders.orderableVersion = true;
        $scope.orderableBandwidth.value = [];
        $scope.user = {
          value: null,
        };

        User.getUser()
          .then((data) => {
            $scope.user.value = data;
          })
          .then(() => {
            Server.get($stateParams.productId, 'orderable/bandwidth', {
              proxypass: true,
            }).then((orderableVersion) => {
              $scope.orderable = orderableVersion;

              angular.forEach(orderableVersion, (value, key) => {
                if (key !== 'orderable' && $scope.orderable[key]) {
                  angular.forEach(value, (v, k) => {
                    $scope.orderable[key][k] = Math.floor(v / 1000);
                  });

                  if ($scope.orderable[key].length) {
                    $scope.orderableBandwidth.value.push(key);
                  }
                }
              });
              $scope.orderableBandwidth.value = sortBy(
                $scope.orderableBandwidth.value,
                (val) => {
                  let ret;
                  switch (val) {
                    case 'premium':
                      ret = 1;
                      break;
                    case 'platinum':
                      ret = 2;
                      break;
                    default:
                      ret = 3;
                      break;
                  }
                  return ret;
                },
              );

              $scope.loaders.orderableVersion = false;
            });
          });
      };

      $scope.selectBandwidthType = function selectBandwidthType(type) {
        if ($scope.orderable[type].length === 1) {
          $scope.selectedBandwidthTypes.value = type;
          $scope.selectedBandwidth.value = head($scope.orderable[type]);
        } else {
          $scope.selectedBandwidth.value = null;
        }
      };

      /*
       *
       *  DURATIONS && PRICE
       *
       */
      $scope.durations = {
        value: {},
        selected: null,
      };

      $scope.user = {
        value: null,
      };

      $scope.getDuration = function getDuration() {
        $scope.durations.value = {};
        $scope.loaders.durations = true;

        Server.orderBandwidth($stateParams.productId, {
          serviceName: $scope.currentActionData,
          bandwidth: $scope.selectedBandwidth.value * 1000,
          type: $scope.selectedBandwidthTypes.value,
        }).then((durations) => {
          $scope.durations.value = durations;

          if ($scope.durations.value.length === 1) {
            $scope.durations.selected = $scope.durations.value[0].durations;
          }

          $scope.loaders.durations = false;
        });
      };

      /*
       *
       *  CONTRACTS
       *
       */
      $scope.contracts = {
        value: [],
      };

      $scope.agree = {
        value: false,
      };

      let bcUrl;
      $scope.displayBc = function displayBc() {
        $scope.loaders.bc = true;
        bcUrl = null;

        $scope.agree.value = false;
        $scope.contracts.value = [];

        return Server.postOrderBandwidth($stateParams.productId, {
          serviceName: $scope.currentActionData,
          bandwidth: $scope.selectedBandwidth.value * 1000,
          type: $scope.selectedBandwidthTypes.value,
          duration: $scope.durations.selected,
        }).then(
          (durations) => {
            $scope.loaders.bc = false;
            $scope.contracts.value = durations.contracts;

            bcUrl = durations.url;
          },
          () => {
            $state
              .go('^')
              .then(() =>
                Alerter.error(
                  $translate.instant('server_order_bandwidth_error'),
                  'server_dashboard_alert',
                ),
              );
          },
        );
      };

      /*
       *
       *  OPEN BC
       *
       */
      $scope.openBC = function openBC() {
        $state.go('^');
        window.open(bcUrl);
      };

      $scope.resetAction = function resetAction() {
        $state.go('^');
      };
    },
  );
