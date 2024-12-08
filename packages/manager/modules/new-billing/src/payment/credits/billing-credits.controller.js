import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

export default class BillingCreditsCtrl {
  /* @ngInject */
  constructor($translate, addVoucherLink, Alerter, balances, BillingCredits) {
    this.addVoucherLink = addVoucherLink;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.billingCredits = BillingCredits;

    this.balances = balances;
  }

  /* ==============================
    =            HELPERS            =
    =============================== */

  static getExpiringDetails(expiring) {
    const copiedSummary = angular.copy(expiring);

    // sort by expiration date to get the less expiring item
    copiedSummary.sort((summaryItemA, summaryItemB) => {
      const dateA = new Date(summaryItemA.expirationDate);
      const dateB = new Date(summaryItemB.expirationDate);
      return dateA - dateB;
    });

    // calculate amount of expirate amount
    const totalAmount = reduce(
      map(copiedSummary, 'amount.value'),
      (total, amountValue) => total + amountValue,
    );

    // use the text of the first item amout to build total amount object
    const totalAmountObject = {
      currencyCode: get(head(copiedSummary), 'amount.currencyCode'),
      value: totalAmount,
      text: get(head(copiedSummary), 'amount.text').replace(
        /\d+(?:[.,]\d+)?/,
        `${totalAmount.toFixed(2)}`,
      ),
    };

    return {
      expirationDate: get(head(copiedSummary), 'expirationDate'),
      amount: totalAmountObject,
      expireSoon:
        moment(get(head(copiedSummary), 'expirationDate')).diff(
          moment(),
          'days',
        ) <= 7,
    };
  }

  /* -----  End of HELPERS  ------ */

  getBalanceDetails({ balanceName }) {
    return this.billingCredits.getBalance(balanceName).then((balance) => ({
      ...balance,
      expiringDetails:
        balance.expiring && balance.expiring.length
          ? this.constructor.getExpiringDetails(balance.expiring)
          : null,
    }));
  }
}
