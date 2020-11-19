import clone from 'lodash/clone';
import flatten from 'lodash/flatten';
import get from 'lodash/get';

angular
  .module('App')
  .controller(
    'HostingBoostTabCtrl',
    (
      $q,
      $scope,
      $state,
      $stateParams,
      $translate,
      atInternet,
      Alerter,
      Hosting,
      HostingBoost,
    ) => {
      atInternet.trackPage({ name: 'web::hosting::boost' });

      $scope.models = {
        product: null,
        boosts: null,
        filters: null,
        disable: null,
      };

      $scope.loaders = {
        product: false,
      };

      $scope.isLoading = false;

      //---------------------------------------------
      // INIT
      //---------------------------------------------
      $scope.init = () => {
        $scope.loaders.product = true;
        Alerter.resetMessage($scope.alerts.main);
        Hosting.getSelected($stateParams.productId, true)
          .then((product) => {
            $scope.models.product = product;
            $scope.refreshTableBoostHistory();

            // Get tasks & start polling if tasks
            HostingBoost.getTasks($stateParams.productId).then((tasks) => {
              if (flatten(tasks).length > 0) {
                $scope.isLoading = true;
              }
              tasks[0].forEach((task) => {
                HostingBoost.pollBoostRequestState({
                  serviceName: product.serviceName,
                  task,
                });
              });
              tasks[1].forEach((task) => {
                HostingBoost.pollBoostDisableState({
                  serviceName: product.serviceName,
                  task,
                });
              });
            });
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_BOOST_error'),
              err,
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.loaders.product = false;
          });
      };

      //---------------------------------------------
      // POLLING
      //---------------------------------------------
      $scope.$on('hosting.boost.request.start', () => {
        $scope.isLoading = true;
        Alerter.success(
          $translate.instant('hosting_tab_BOOST_request_activation'),
          $scope.alerts.main,
        );
      });

      $scope.$on('hosting.boost.request.done', () => {
        $scope.init();
        $scope.isLoading = false;
        Alerter.success(
          $translate.instant('hosting_tab_BOOST_request_success'),
          $scope.alerts.main,
        );
      });

      $scope.$on('hosting.boost.request.error', (err) => {
        Alerter.alertFromSWS(
          $translate.instant('hosting_tab_BOOST_error'),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      $scope.$on('hosting.boost.disable.start', () => {
        $scope.isLoading = true;
        Alerter.success(
          $translate.instant('hosting_tab_BOOST_disable_started'),
          $scope.alerts.main,
        );
      });

      $scope.$on('hosting.boost.disable.done', () => {
        $scope.init();
        $scope.isLoading = false;
        Alerter.success(
          $translate.instant('hosting_tab_BOOST_disable_success'),
          $scope.alerts.main,
        );
      });

      $scope.$on('hosting.boost.disable.error', (err) => {
        Alerter.alertFromSWS(
          $translate.instant('hosting_tab_BOOST_disable_error'),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      $scope.$on('hosting.boost.error', (err) => {
        Alerter.alertFromSWS(
          $translate.instant('hosting_tab_BOOST_error'),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      $scope.$on('$destroy', () => {
        HostingBoost.killAllPolling();
      });

      //---------------------------------------------
      // BOOSTS
      //---------------------------------------------
      $scope.refreshTableBoostHistory = () => {
        HostingBoost.getHistory($stateParams.productId)
          .then((hostingBoostIds) => {
            $scope.hostingBoosts = hostingBoostIds
              .sort((d1, d2) => moment(d2).diff(moment(d1)))
              .map((id) => ({ id }));
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_BOOST_error'),
              err,
              $scope.alerts.main,
            );
          });
      };

      /*
       * if you want transform item must return transformated item
       * item is the current item to transform
       */
      $scope.transformItem = (item) => {
        if (item.transformed) {
          return $q((resolve) => resolve(item));
        }
        return HostingBoost.getHistoryEntry(
          $stateParams.productId,
          item.id,
        ).then((originalBoost) => {
          const boost = clone(originalBoost);

          boost.id = item.id;
          boost.transformed = true;
          return boost;
        });
      };

      $scope.$on('hosting.tabs.boostHistory.refresh', () => {
        $scope.refreshTableBoostHistory();
      });
    },
  );
