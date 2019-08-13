angular.module('managerApp').controller('TelecomTelephonyBillingAccountBillingGroupRepaymentsCtrl', function ($q, $stateParams, $translate, OvhApiTelephony, TelephonyMediator, TucToast) {
  const self = this;

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.consumptions = {
      all: [],
      raw: [],
      hasAmountAvailable: null,
      total: {
        duration: null,
        price: null,
        call: null,
      },
      repayable: {
        price: null,
        call: null,
      },
      deferred: {
        price: null,
        call: null,
      },
      isLoading: false,
    };

    self.groupRepaymentsForm = {
      billingNumber: null,
      isAsking: false,
    };

    self.consumptions.isLoading = true;

    return TelephonyMediator
      .getGroup($stateParams.billingAccount)
      .then(group => group.getRepaymentConsumption().then((repaymentConsumptions) => {
        self.consumptions.all = _.get(repaymentConsumptions, 'groupRepayments.all');
        self.consumptions.raw = _.get(repaymentConsumptions, 'groupRepayments.raw');

        // total
        self.consumptions.total.duration = _.sum(self.consumptions.raw, 'duration');
        self.consumptions.total.price = _.chain(self.consumptions.raw).sum('price').floor(2).value();
        self.consumptions.total.call = _.chain(self.consumptions.all).size().value();

        // repayable
        const repayable = _.chain(self.consumptions.all).filter('repayable');
        self.consumptions.repayable.price = repayable.pluck('price').sum().floor(2).value();
        self.consumptions.repayable.call = repayable.size().value();
        self.consumptions.hasAmountAvailable = _.find(self.consumptions.raw, 'repayable');

        // deferred
        self.consumptions.deferred.price = _.floor(
          self.consumptions.total.price - self.consumptions.repayable.price,
          2,
        );
        self.consumptions.deferred.call = self.consumptions.total.call
          - self.consumptions.repayable.call;

        const dialedNumbers = _.chain(self.consumptions.raw).groupBy('dialed').keysIn().value();
        self.consumptions.groupedByDialedNumber = _.map(dialedNumbers, (dialed) => {
          const consumptions = _.filter(self.consumptions.raw, { dialed });
          const totalPrice = _.chain(consumptions).sum('price').round(2).value();
          const operators = _.chain(consumptions).groupBy('operator').keysIn().sort()
            .value();
          const details = _.map(operators, (operator) => {
            const operatorConsumptions = _.filter(consumptions, { operator });
            const totalOperatorPrice = _.chain(operatorConsumptions).sum('price').round(2).value();
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
        TucToast.error([$translate.instant('telephony_group_billing_group_repayments_error'), (err.data && err.data.message) || ''].join(' '));
        return $q.reject(err);
      }).finally(() => {
        self.consumptions.isLoading = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  /* =============================
  =            EVENTS            =
  ============================== */

  self.askHistoryRepaymentConsumption = function () {
    self.groupRepaymentsForm.isAsking = true;

    return OvhApiTelephony.HistoryRepaymentConsumption().v6().create({
      billingAccount: $stateParams.billingAccount,
    }, {
      billingNumber: self.groupRepaymentsForm.billingNumber,
    }).$promise.then(() => {
      TucToast.success($translate.instant('telephony_group_billing_group_repayments_ask_new_repayment_success'));
      init();
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_group_billing_group_repayments_ask_new_repayment_error'), _.get(error, 'data.message')].join(' '));
      init();
      return $q.reject(error);
    }).finally(() => {
      self.groupRepaymentsForm.isAsking = false;
    });
  };

  /* -----  End of EVENTS  ------ */

  init();
});
