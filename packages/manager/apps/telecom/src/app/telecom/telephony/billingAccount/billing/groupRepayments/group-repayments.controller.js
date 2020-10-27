import filter from 'lodash/filter';
import find from 'lodash/find';
import floor from 'lodash/floor';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import keysIn from 'lodash/keysIn';
import map from 'lodash/map';
import size from 'lodash/size';
import sumBy from 'lodash/sumBy';
import round from 'lodash/round';

export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingGroupRepaymentsCtrl(
  $q,
  $stateParams,
  $translate,
  OvhApiTelephony,
  TelephonyMediator,
  TucToast,
) {
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

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) =>
        group.getRepaymentConsumption().then((repaymentConsumptions) => {
          self.consumptions.all = get(
            repaymentConsumptions,
            'groupRepayments.all',
          );
          self.consumptions.raw = get(
            repaymentConsumptions,
            'groupRepayments.raw',
          );

          // total
          self.consumptions.total.duration = sumBy(
            self.consumptions.raw,
            'duration',
          );
          self.consumptions.total.price = floor(
            sumBy(self.consumptions.raw, 'price'),
            2,
          );
          self.consumptions.total.call = size(self.consumptions.all);

          // repayable
          const repayable = filter(self.consumptions.all, 'repayable');
          self.consumptions.repayable.price = floor(
            sumBy(repayable, 'price'),
            2,
          );
          self.consumptions.repayable.call = size(repayable);
          self.consumptions.hasAmountAvailable = find(
            self.consumptions.raw,
            'repayable',
          );

          // deferred
          self.consumptions.deferred.price = floor(
            self.consumptions.total.price - self.consumptions.repayable.price,
            2,
          );
          self.consumptions.deferred.call =
            self.consumptions.total.call - self.consumptions.repayable.call;

          const dialedNumbers = keysIn(
            groupBy(self.consumptions.raw, 'dialed'),
          );
          self.consumptions.groupedByDialedNumber = map(
            dialedNumbers,
            (dialed) => {
              const consumptions = filter(self.consumptions.raw, {
                dialed,
              });
              const totalPrice = round(sumBy(consumptions, 'price'), 2);
              const operators = keysIn(
                groupBy(consumptions, 'operator'),
              ).sort();
              const details = map(operators, (operator) => {
                const operatorConsumptions = filter(consumptions, {
                  operator,
                });
                const totalOperatorPrice = round(
                  sumBy(operatorConsumptions, 'price'),
                  2,
                );
                return {
                  operator,
                  totalOperatorConsumption: size(operatorConsumptions),
                  totalOperatorDuration: sumBy(
                    operatorConsumptions,
                    'duration',
                  ),
                  totalOperatorPrice,
                };
              });
              return {
                dialed,
                totalConsumption: size(consumptions),
                totalDuration: sumBy(consumptions, 'duration'),
                totalPrice,
                details,
              };
            },
          );
          return repaymentConsumptions;
        }),
      )
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_group_billing_group_repayments_error',
            ),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
        return $q.reject(err);
      })
      .finally(() => {
        self.consumptions.isLoading = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  /* =============================
  =            EVENTS            =
  ============================== */

  self.askHistoryRepaymentConsumption = function askHistoryRepaymentConsumption() {
    self.groupRepaymentsForm.isAsking = true;

    return OvhApiTelephony.HistoryRepaymentConsumption()
      .v6()
      .create(
        {
          billingAccount: $stateParams.billingAccount,
        },
        {
          billingNumber: self.groupRepaymentsForm.billingNumber,
        },
      )
      .$promise.then(() => {
        TucToast.success(
          $translate.instant(
            'telephony_group_billing_group_repayments_ask_new_repayment_success',
          ),
        );
        init();
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_group_billing_group_repayments_ask_new_repayment_error',
            ),
            get(error, 'data.message'),
          ].join(' '),
        );
        init();
        return $q.reject(error);
      })
      .finally(() => {
        self.groupRepaymentsForm.isAsking = false;
      });
  };

  /* -----  End of EVENTS  ------ */

  init();
}
