import set from 'lodash/set';
import sumBy from 'lodash/sumBy';

export default /* @ngInject */ function TelecomTelephonyServiceConsumptionOutgoingCallsCtrl(
  $stateParams,
  $q,
  $translate,
  $filter,
  $timeout,
  OvhApiTelephony,
  TucToastError,
  tucVoipService,
) {
  const self = this;

  function fetchOutgoingConsumption() {
    return tucVoipService
      .getServiceConsumption({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .then((result) =>
        result
          .filter((conso) => conso.wayType !== 'incoming' && conso.duration > 0)
          .map((conso) => {
            set(conso, 'durationAsDate', new Date(conso.duration * 1000));
            return conso;
          }),
      );
  }

  function init() {
    self.consumption = {
      raw: null,
      sorted: null,
      paginated: null,
      selected: null,
      orderBy: 'creationDatetime',
      orderDesc: true,
      filterBy: {
        dialed: undefined,
      },
      showFilter: false,
      sum: {
        pricePlan: {
          calls: null,
          durationAsDate: null,
        },
        outPlan: {
          calls: null,
          durationAsDate: null,
          price: null,
        },
      },
    };

    self.period = {
      start: moment().startOf('month'),
      end: moment().endOf('month'),
    };

    fetchOutgoingConsumption().then(
      (result) => {
        self.consumption.raw = angular.copy(result);
        self.consumption.sorted = angular.copy(result);
        self.applySorting();
        self.consumption.sum.pricePlan.calls = sumBy(
          self.consumption.raw,
          (conso) => (conso.planType === 'priceplan' ? 1 : 0),
        );
        self.consumption.sum.pricePlan.durationAsDate = new Date(
          sumBy(self.consumption.raw, (conso) =>
            conso.planType === 'priceplan' ? conso.duration : 0,
          ) * 1000,
        );
        self.consumption.sum.outPlan.calls = sumBy(
          self.consumption.raw,
          (conso) => (conso.planType === 'outplan' ? 1 : 0),
        );
        self.consumption.sum.outPlan.durationAsDate = new Date(
          sumBy(self.consumption.raw, (conso) =>
            conso.planType === 'outplan' ? conso.duration : 0,
          ) * 1000,
        );
        let priceSuffix = '';
        self.consumption.sum.outPlan.price = sumBy(
          self.consumption.raw,
          (conso) => {
            if (conso.planType === 'outplan' && conso.priceWithoutTax) {
              // since we compute the sum manually we must guess and add the currency symbol
              // @TODO fetch sum from api when available
              priceSuffix =
                priceSuffix ||
                conso.priceWithoutTax.text.replace(/[0-9.,\s]/g, '');
              return conso.priceWithoutTax.value;
            }
            return null;
          },
        );
        self.consumption.sum.outPlan.price = `${Math.floor(
          self.consumption.sum.outPlan.price * 100.0,
          2,
        ) / 100.0} ${priceSuffix}`;
      },
      (err) => new TucToastError(err),
    );
  }

  self.refresh = function refresh() {
    OvhApiTelephony.Service()
      .VoiceConsumption()
      .v6()
      .resetCache();
    OvhApiTelephony.Service()
      .VoiceConsumption()
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
      dialed: undefined,
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
