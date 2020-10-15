import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import keysIn from 'lodash/keysIn';
import map from 'lodash/map';
import round from 'lodash/round';
import size from 'lodash/size';
import sumBy from 'lodash/sumBy';

export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingCalledFeesCtrl(
  $filter,
  $q,
  $stateParams,
  $translate,
  TelephonyMediator,
  TucToast,
) {
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
      .then((group) =>
        group.getRepaymentConsumption().then((repaymentConsumptions) => {
          self.consumptions.raw = get(repaymentConsumptions, 'calledFees');
          self.consumptions.totalPrice = $filter('number')(
            -round(sumBy(self.consumptions.raw, 'price'), 2),
            2,
          );
          const dialedNumbers = keysIn(
            groupBy(self.consumptions.raw, 'dialed'),
          );
          self.consumptions.groupedByDialedNumber = map(
            dialedNumbers,
            (dialed) => {
              const consumptions = filter(self.consumptions.raw, {
                dialed,
              });
              const totalPrice = -round(sumBy(consumptions, 'price'), 2);
              const operators = keysIn(groupBy(consumptions, 'operator'));
              const details = map(operators, (operator) => {
                const operatorConsumptions = filter(consumptions, {
                  operator,
                });
                const totalOperatorPrice = -round(
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
            $translate.instant('telephony_group_billing_called_fees_error'),
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

  init();
}
