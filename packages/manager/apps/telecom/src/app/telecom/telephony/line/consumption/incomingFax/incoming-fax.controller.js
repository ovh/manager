import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';

export default /* @ngInject */ function TelecomTelephonyLineConsumptionIncomingFaxCtrl(
  $stateParams,
  $q,
  $translate,
  $filter,
  $timeout,
  OvhApiTelephony,
  TucToastError,
) {
  const self = this;

  function fetchIncomingConsumption() {
    return OvhApiTelephony.Service()
      .FaxConsumption()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.Service()
                  .FaxConsumption()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    consumptionId: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => flatten(chunkResult)),
      )
      .then((resultParam) => {
        let result = map(resultParam, 'value');
        result = filter(result, (conso) => conso.wayType === 'received');
        return result;
      });
  }

  function init() {
    self.consumption = {
      raw: null,
      sorted: null,
      paginated: null,
      selected: null,
      pagesSum: 0,
      isLoading: false,
      orderBy: 'creationDatetime',
      orderDesc: true,
      filterBy: {
        calling: undefined,
      },
      showFilter: false,
    };

    self.period = {
      start: moment().startOf('month'),
      end: moment().endOf('month'),
    };

    self.consumption.isLoading = true;
    fetchIncomingConsumption()
      .then((result) => {
        self.consumption.raw = angular.copy(result);
        self.applySorting();
        self.consumption.pagesSum = sumBy(
          self.consumption.raw,
          (conso) => conso.pages,
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.consumption.isLoading = false;
      });
  }

  self.refresh = function refresh() {
    OvhApiTelephony.Service()
      .FaxConsumption()
      .v6()
      .resetCache();
    OvhApiTelephony.Service()
      .FaxConsumption()
      .v6()
      .resetQueryCache();
    init();
  };

  self.applySorting = function applySorting() {
    let data = angular.copy(self.consumption.raw);
    data = $filter('filter')(data, self.consumption.filterBy);
    data = $filter('orderBy')(
      data,
      self.consumption.orderBy,
      self.consumption.orderDesc,
    );
    self.consumption.sorted = data;
  };

  self.toggleShowFilter = function toggleShowFilter() {
    self.consumption.showFilter = !self.consumption.showFilter;
    self.consumption.filterBy = {
      calling: undefined,
    };
    self.applySorting();
  };

  self.orderBy = function orderBy(by) {
    if (self.consumption.orderBy === by) {
      self.consumption.orderDesc = !self.consumption.orderDesc;
    } else {
      self.consumption.orderBy = by;
    }
    self.applySorting();
  };

  init();
}
