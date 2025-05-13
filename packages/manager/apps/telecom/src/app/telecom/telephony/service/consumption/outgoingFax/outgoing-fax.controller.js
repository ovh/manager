import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';

export default /* @ngInject */ function TelecomTelephonyServiceConsumptionOutgoingFaxCtrl(
  $stateParams,
  $q,
  $translate,
  $filter,
  $timeout,
  OvhApiTelephony,
  TucToastError,
) {
  const self = this;

  function fetchOutgoingConsumption() {
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
        result = filter(result, (conso) => conso.wayType === 'sent');
        return result;
      });
  }

  self.$onInit = function $onInit() {
    self.consumption = {
      raw: null,
      sorted: null,
      paginated: null,
      selected: null,
      pagesSum: 0,
      orderBy: 'creationDatetime',
      orderDesc: true,
      filterBy: {
        called: undefined,
      },
      showFilter: false,
    };

    self.period = {
      start: moment().startOf('month'),
      end: moment().endOf('month'),
    };

    fetchOutgoingConsumption().then(
      (result) => {
        self.consumption.raw = angular.copy(result);
        self.applySorting();
        self.consumption.pagesSum = sumBy(
          self.consumption.raw,
          (conso) => conso.pages,
        );
        let priceSuffix = '';
        self.consumption.priceSum = sumBy(self.consumption.raw, (conso) => {
          if (conso.priceWithoutTax) {
            priceSuffix =
              priceSuffix ||
              conso.priceWithoutTax.text.replace(/[0-9.,\s]/g, '');
            return conso.priceWithoutTax.value;
          }
          return 0.0;
        });
        self.consumption.priceSum = `${Math.floor(
          self.consumption.priceSum * 100.0,
          2,
        ) / 100.0} ${priceSuffix}`;
      },
      (err) => new TucToastError(err),
    );
  };

  self.refresh = function refresh() {
    OvhApiTelephony.Service()
      .FaxConsumption()
      .v6()
      .resetCache();
    OvhApiTelephony.Service()
      .FaxConsumption()
      .v6()
      .resetQueryCache();
    self.$onInit();
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
      called: undefined,
    };
    self.applySorting();
  };
}
