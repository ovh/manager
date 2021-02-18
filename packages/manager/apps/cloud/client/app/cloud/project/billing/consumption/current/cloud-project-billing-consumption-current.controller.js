angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingConsumptionCurrentCtrl',
    function CloudProjectBillingConsumptionCurrentCtrl(
      $q,
      $translate,
      $stateParams,
      CucCloudMessage,
      CloudProjectBillingService,
      OvhApiCloudProjectUsageCurrent,
    ) {
      const self = this;
      self.data = {};

      function init() {
        self.loading = true;

        return OvhApiCloudProjectUsageCurrent.v6()
          .get({ serviceName: $stateParams.projectId })
          .$promise.then((billingInfo) =>
            CloudProjectBillingService.getConsumptionDetails(
              billingInfo,
              billingInfo,
            ),
          )
          .then((data) => {
            self.data = data;
          })
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpb_error_message'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return $q.reject(err);
          })
          .finally(() => {
            self.loading = false;
          });
      }

      init();
    },
  );
