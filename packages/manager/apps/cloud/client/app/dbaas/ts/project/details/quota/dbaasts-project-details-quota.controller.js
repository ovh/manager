angular
  .module('managerApp')
  .controller(
    'DBaasTsProjectDetailsQuotaCtrl',
    function DBaasTsProjectDetailsQuotaCtrl(
      $q,
      $uibModal,
      $state,
      $scope,
      $stateParams,
      $translate,
      Toast,
      OvhApiDBaasTsProjectQuota,
      OvhApiDBaasTsProject,
    ) {
      // -- Variables declaration --

      const self = this;
      const { serviceName } = $stateParams;

      self.loaders = {
        init: false,
      };

      self.data = {
        quotas: {},
      };

      // -- Initialization --

      function init() {
        self.loaders.init = true;

        OvhApiDBaasTsProject.v6()
          .get({
            serviceName,
          })
          .$promise.then((project) => {
            self.project = project;

            return OvhApiDBaasTsProjectQuota.v6()
              .query({
                serviceName,
              })
              .$promise.then((quotas) => {
                self.data.quotas = quotas;
              });
          })
          .catch((err) => {
            Toast.error(
              [
                $translate.instant('dtpdq_quota_loading_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            self.data.quota = null;
          })
          .finally(() => {
            self.loaders.init = false;
          });
      }

      init();

      // --

      self.refresh = function refresh() {
        OvhApiDBaasTsProjectQuota.v6().resetQueryCache();
        init();
      };

      self.openIncreaseQuotaPopup = function openIncreaseQuotaPopup() {
        $uibModal.open({
          templateUrl:
            'app/dbaas/ts/project/details/quota/dbaasts-project-details-quota-enlarge.html',
          // eslint-disable-next-line no-shadow
          controller($scope) {
            // Passed as a variable, since it will later depend from an API call result
            const message = 'dtpdq_increase_support';
            $scope.message = $translate.instant(message);
          },
        });
      };
    },
  );
