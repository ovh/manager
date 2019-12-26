angular
  .module('managerApp')
  .controller(
    'DBaasTsProjectDetailsBillingCtrl',
    function DBaasTsProjectDetailsBillingCtrl(
      $q,
      $scope,
      $state,
      $stateParams,
      $translate,
      Toast,
      OvhApiDBaasTsProjectBilling,
    ) {
      // -- Variables declaration --

      const self = this;
      const { serviceName } = $stateParams;
      const firstDayOfMonth = moment({
        y: moment().year(),
        M: moment().month(),
        d: 1,
      });

      self.loaders = {
        init: false,
      };

      self.data = {
        billing: {},
        monthBilling: angular.copy(firstDayOfMonth),
      };

      function getMonthYear() {
        return `${self.data.monthBilling.year()}-${self.data.monthBilling.format(
          'MM',
        )}`;
      }

      // -- Initialization --

      function init() {
        self.loaders.init = true;

        OvhApiDBaasTsProjectBilling.v6()
          .get({
            serviceName,
            from: getMonthYear(),
          })
          .$promise.then((billing) => {
            self.data.billing = billing;
          })
          .catch((err) => {
            Toast.error(
              [
                $translate.instant('dtpdb_loading_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            self.data.billing = null;
          })
          .finally(() => {
            self.loaders.init = false;
          });
      }

      // --

      self.refresh = function refresh() {
        OvhApiDBaasTsProjectBilling.v6().resetCache();
        init();
      };

      self.getDateInfo = function previousMonth() {
        return {
          month: self.data.monthBilling.format('MMM'),
          year: self.data.monthBilling.year(),
        };
      };

      self.previousMonth = function previousMonth() {
        self.data.monthBilling = self.data.monthBilling.subtract(1, 'month');
        init();
      };

      self.nextMonth = function nextMonth() {
        self.data.monthBilling = self.data.monthBilling.add(1, 'month');
      };

      self.getLimit = function getLimit() {
        return self.data.monthBilling.diff(
          angular.copy(firstDayOfMonth).set('date', 1),
        );
      };

      // --

      init();
    },
  );
