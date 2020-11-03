import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';

export default class BillingHistoryBalanceCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    OvhApiMe,
    BillingDebtAccount,
    ovhPaymentMethod,
    Alerter,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
    this.BillingDebtAccount = BillingDebtAccount;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.Alerter = Alerter;

    this.balance = null;
    this.depositRequests = null;
    this.paymentAccepted = false;

    this.loading = {
      init: false,
      pay: false,
    };
    this.model = {
      paymentMethod: null,
    };
    this.paymentSref =
      "app.account.billing.payment.method.add({from: 'app.account.billing.main.history.balance'})";
  }

  getBalance() {
    return this.BillingDebtAccount.getDebtAccount().catch((error) => {
      if (error.status === 404) {
        return {
          active: false,
        };
      }

      return this.$q.reject(error);
    });
  }

  /* =============================
    =            EVENTS            =
    ============================== */

  onBalancePayFormSubmit() {
    this.loading.pay = true;

    return this.BillingDebtAccount.payDebtWithPaymentMethod(
      this.model.paymentMethod.id,
    )
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('billing_history_balance_pay_success', {
            trackHref: this.$state.href('app.account.billing.payments.request'),
          }),
          'billing_balance',
        );
        this.paymentAccepted = true;
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('billing_history_balance_pay_error'),
          {
            message: get(error, 'message'),
            type: 'ERROR',
          },
          'billing_balance',
        );
      })
      .finally(() => {
        this.loading.pay = false;
      });
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.OvhApiMe.DepositRequest()
      .v6()
      .query()
      .$promise.then((deposit) => {
        this.depositRequests = deposit;

        if (!this.depositRequests.length) {
          return this.$q
            .all({
              balance: this.getBalance(),
              paymentMethods: this.ovhPaymentMethod.getAllPaymentMethods(),
            })
            .then((response) => {
              this.balance = response.balance;
              this.paymentMethods = filter(
                response.paymentMethods,
                ({ paymentType, status }) =>
                  ['INTERNAL_TRUSTED_ACCOUNT', 'ENTERPRISE'].indexOf(
                    paymentType,
                  ) === -1 &&
                  ['CANCELED_BY_CUSTOMER', 'CANCELING'].indexOf(status) === -1,
              );

              this.model.paymentMethod = find(this.paymentMethods, {
                default: true,
              });
            });
        }

        return this.depositRequests;
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('billing_history_balance_load_error'),
          {
            message: get(error, 'data.message'),
            type: 'ERROR',
          },
          'billing_balance',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
