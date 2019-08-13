angular.module('managerApp').controller('TelecomTelephonyBillingAccountBillingCalledFeesCtrl', function ($filter, $q, $stateParams, $translate, TelephonyMediator, TucToast) {
  const self = this;

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.consumptions = {
      raw: [],
      totalPrice: null,
      groupedByDialedNumber: [],
      isLoading: false,
    };
    self.consumptions.isLoading = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then(group => group.getRepaymentConsumption().then((repaymentConsumptions) => {
        self.consumptions.raw = _.get(repaymentConsumptions, 'calledFees');
        self.consumptions.totalPrice = $filter('number')(-_.chain(self.consumptions.raw).sum('price').round(2).value(), 2);
        const dialedNumbers = _.chain(self.consumptions.raw).groupBy('dialed').keysIn().value();
        self.consumptions.groupedByDialedNumber = _.map(dialedNumbers, (dialed) => {
          const consumptions = _.filter(self.consumptions.raw, { dialed });
          const totalPrice = -_.chain(consumptions).sum('price').round(2).value();
          const operators = _.chain(consumptions).groupBy('operator').keysIn().value();
          const details = _.map(operators, (operator) => {
            const operatorConsumptions = _.filter(consumptions, { operator });
            const totalOperatorPrice = -_.chain(operatorConsumptions).sum('price').round(2).value();
            return {
              operator,
              totalOperatorConsumption: _.size(operatorConsumptions),
              totalOperatorDuration: _.sum(operatorConsumptions, 'duration'),
              totalOperatorPrice,
            };
          });
          return {
            dialed,
            totalConsumption: _.size(consumptions),
            totalDuration: _.sum(consumptions, 'duration'),
            totalPrice,
            details,
          };
        });
        return repaymentConsumptions;
      })).catch((err) => {
        TucToast.error([$translate.instant('telephony_group_billing_called_fees_error'), (err.data && err.data.message) || ''].join(' '));
        return $q.reject(err);
      }).finally(() => {
        self.consumptions.isLoading = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
