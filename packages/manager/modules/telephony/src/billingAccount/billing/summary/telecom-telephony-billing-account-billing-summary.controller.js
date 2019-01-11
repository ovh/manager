angular.module('managerApp').controller('TelecomTelephonyBillingAccountBillingSummaryCtrl', function ($q, $filter, $window, $timeout, $stateParams, $translate, TelephonyMediator, OvhApiTelephony, TucToast) {
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
    return OvhApiTelephony.Service().VoiceConsumption().Aapi().get({
      billingAccount: $stateParams.billingAccount,
    }).$promise.then((consumption) => {
      _.forEach(['lines', 'numbers', 'fax'], (serviceType) => {
        _.forEach(self.group[serviceType], (service) => {
          _.forEach(consumption.details, (s, idx) => {
            if (s.service === service.serviceName) {
              consumption.details[idx].description = service.description; // eslint-disable-line
              consumption.details[idx].type = serviceType; // eslint-disable-line
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

  this.$onInit = function () {
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.group = group;
        return self.group;
      })
      .then(fetchConsumption, (err) => {
        TucToast.error([$translate.instant('telephony_group_billing_summary_consumptioninit_error'), (err.data && err.data.message) || ''].join(' '));
        return $q.reject(err);
      });
  };
});
