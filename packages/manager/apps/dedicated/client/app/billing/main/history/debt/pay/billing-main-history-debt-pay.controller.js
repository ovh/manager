import get from 'lodash/get';

export default class BillingHistoryDebtPayCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    $window,
    Alerter,
    atInternet,
    OvhApiMe,
  ) {
    // Injections
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.OvhApiMe = OvhApiMe;

    // Other attributes used in view
    this.loading = {
      pay: false,
    };
  }

  closeModal() {
    return this.$state.go('app.account.billing.main.history');
  }

  /* =============================
    =            EVENTS            =
    ============================== */

  onDebtPayFormSubmit() {
    this.loading.pay = true;
    this.atInternet.trackClick({
      name:
        'dedicated::account::billing::main::history::pay-debt::pay::billing_pay_balance',
      type: 'action',
    });
    let promise;

    if (this.$stateParams.debtId !== 'all') {
      promise = this.OvhApiMe.DebtAccount()
        .Debt()
        .v6()
        .pay(
          {
            debtId: this.$stateParams.debtId,
          },
          {},
        ).$promise;
    } else {
      promise = this.OvhApiMe.DebtAccount()
        .v6()
        .pay().$promise;
    }

    return promise
      .then((order) => {
        this.Alerter.success(
          this.$translate.instant('billing_main_history_debt_pay_success', {
            t0: get(order, 'data.orderId') || get(order, 'orderId'),
            t1: get(order, 'data.url') || get(order, 'url'),
          }),
          'billing_main_alert',
        );

        this.$window.open(
          get(order, 'data.url') || get(order, 'url'),
          '_blank',
        );
      })
      .catch((error) => {
        if (get(error, 'data.message') === 'Nothing to pay') {
          return this.Alerter.set(
            'alert-info',
            this.$translate.instant(
              'billing_main_history_debt_pay_error_nothing_to_pay',
            ),
            null,
            'billing_main_alert',
          );
        }

        return this.Alerter.error(
          `${this.$translate.instant(
            'billing_main_history_debt_pay_error',
          )} ${get(error, 'data.message', '')}`,
          'billing_main_alert',
        );
      })
      .finally(() => {
        this.loading.pay = false;
        this.closeModal();
      });
  }

  /* -----  End of EVENTS  ------ */
}
