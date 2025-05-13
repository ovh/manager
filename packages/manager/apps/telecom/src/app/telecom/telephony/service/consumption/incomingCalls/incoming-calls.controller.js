import set from 'lodash/set';
import sumBy from 'lodash/sumBy';

export default /* @ngInject */ function TelecomTelephonyServiceConsumptionIncomingCallsCtrl(
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

  function fetchIncomingConsumption() {
    return tucVoipService
      .getServiceConsumption({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .then((result) =>
        result
          .filter((conso) => conso.wayType !== 'outgoing')
          .map((conso) => {
            set(conso, 'durationAsDate', new Date(conso.duration * 1000));
            if (conso.wayType === 'incoming' && conso.duration === 0) {
              set(conso, 'wayType', 'missing');
            }
            if (/anonymous/.test(conso.calling)) {
              set(
                conso,
                'calling',
                $translate.instant('telephony_service_consumption_anonymous'),
              );
            }
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
      durationSum: 0,
      orderBy: 'creationDatetime',
      orderDesc: true,
      filterBy: {
        calling: undefined,
        dialed: undefined,
      },
      showFilter: false,
    };

    self.period = {
      start: moment().startOf('month'),
      end: moment().endOf('month'),
    };

    self.serviceName = $stateParams.serviceName;

    fetchIncomingConsumption().then(
      (result) => {
        self.consumption.raw = angular.copy(result);
        self.consumption.sorted = angular.copy(result);
        self.consumption.durationSum = new Date(
          sumBy(self.consumption.raw, (conso) => conso.duration) * 1000,
        );
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
      calling: undefined,
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
