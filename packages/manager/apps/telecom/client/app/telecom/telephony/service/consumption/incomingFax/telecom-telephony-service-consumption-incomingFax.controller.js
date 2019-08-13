angular.module('managerApp').controller('TelecomTelephonyServiceConsumptionIncomingFaxCtrl', function ($stateParams, $q, $translate, $filter, $timeout, OvhApiTelephony, TucToastError) {
  const self = this;

  function fetchIncomingConsumption() {
    return OvhApiTelephony.Service().FaxConsumption().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise
      .then(ids => $q
        .all(_.map(
          _.chunk(ids, 50),
          chunkIds => OvhApiTelephony.Service().FaxConsumption().v6().getBatch({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            consumptionId: chunkIds,
          }).$promise,
        ))
        .then(chunkResult => _.flatten(chunkResult)))
      .then((resultParam) => {
        let result = _.pluck(resultParam, 'value');
        result = _.filter(result, conso => conso.wayType === 'received');
        return result;
      });
  }

  self.$onInit = function () {
    self.consumption = {
      raw: null,
      sorted: null,
      selected: null,
      pagesSum: 0,
      orderBy: 'creationDatetime',
      filterBy: {
        calling: undefined,
      },
      showFilter: false,
    };

    self.period = {
      start: moment().startOf('month'),
      end: moment().endOf('month'),
    };

    fetchIncomingConsumption().then((result) => {
      self.consumption.raw = angular.copy(result);
      self.applySorting();
      self.consumption.pagesSum = _.sum(self.consumption.raw, conso => conso.pages);
    }, err => new TucToastError(err));
  };

  self.refresh = function () {
    OvhApiTelephony.Service().FaxConsumption().v6().resetCache();
    OvhApiTelephony.Service().FaxConsumption().v6().resetQueryCache();
    self.$onInit();
  };

  self.applySorting = function () {
    let data = angular.copy(self.consumption.raw);
    data = $filter('filter')(data, self.consumption.filterBy);
    data = $filter('orderBy')(
      data,
      self.consumption.orderBy,
      self.consumption.orderDesc,
    );
    self.consumption.sorted = data;
  };

  self.toggleShowFilter = function () {
    self.consumption.showFilter = !self.consumption.showFilter;
    self.consumption.filterBy = {
      calling: undefined,
    };
    self.applySorting();
  };
});
