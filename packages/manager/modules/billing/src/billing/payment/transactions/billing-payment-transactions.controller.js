import get from 'lodash/get';

export default class BillingPaymentTransactionsCtrl {
  /* @ngInject */
  constructor($q, $translate, Alerter, OvhApiMe) {
    // dependencies injection
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.OvhApiMe = OvhApiMe;

    // other attributes used in view
    this.loading = {
      init: false,
    };

    this.statusTypeOptions = null;
  }

  static get ALERTER_ID() {
    return 'billing_payment_transaction_alert';
  }

  /* ===============================
  =            DATAGRID            =
  ================================ */

  getTransactions($config) {
    return this.OvhApiMe.Payment()
      .Transaction()
      .v6()
      .query()
      .$promise.then((transactions) => {
        const transactionsInPage = transactions
          .slice($config.offset - 1, $config.offset - 1 + $config.pageSize)
          .map((id) => ({ transactionId: id }));

        return {
          data:
            get($config, 'sort.dir') === 1
              ? transactionsInPage.reverse()
              : transactionsInPage,
          meta: {
            totalCount: transactions.length,
          },
        };
      })
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('billing_payment_transactions_init_error'),
            get(error, 'data.message'),
          ].join(' '),
          BillingPaymentTransactionsCtrl.ALERTER_ID,
        );
      });
  }

  getTransaction({ transactionId }) {
    return this.OvhApiMe.Payment()
      .Transaction()
      .v6()
      .get({
        transactionId,
      }).$promise;
  }

  /* -----  End of DATAGRID  ------ */
}
