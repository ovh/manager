import forEach from 'lodash/forEach';

export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingSummaryCtrl(
  $q,
  $filter,
  $window,
  $timeout,
  $stateParams,
  $translate,
  TelephonyMediator,
  OvhApiTelephony,
  TucToast,
) {
  const self = this;

  self.group = null;
  self.consumptionSummary = null;
  self.consumptionDetails = {
    raw: null,
  };

  /*= ==============================
  =            HELPERS            =
  =============================== */

  function fetchConsumption() {
    return OvhApiTelephony.Service()
      .VoiceConsumption()
      .Aapi()
      .get({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((consumption) => {
        forEach(['lines', 'numbers', 'fax'], (serviceType) => {
          forEach(self.group[serviceType], (service) => {
            forEach(consumption.details, (s, idx) => {
              if (s.service === service.serviceName) {
                // eslint-disable-next-line no-param-reassign
                consumption.details[idx].description = service.description;
                // eslint-disable-next-line no-param-reassign
                consumption.details[idx].type = serviceType;
              }
            });
          });
        });

        self.consumptionDetails.raw = consumption.details;
        self.consumptionSummary = consumption.summary;
      });
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  this.$onInit = function $onInit() {
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.group = group;
        return self.group;
      })
      .then(fetchConsumption, (err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_group_billing_summary_consumptioninit_error',
            ),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
        return $q.reject(err);
      });
  };
}
