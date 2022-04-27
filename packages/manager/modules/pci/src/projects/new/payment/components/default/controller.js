import 'moment';

const PAYMENTS_TYPES = {
  CREDIT_CARD: 'CREDIT_CARD',
  BANK_ACCOUNT: 'BANK_ACCOUNT',
  DEFERRED_PAYMENT_ACCOUNT: 'DEFERRED_PAYMENT_ACCOUNT',
};

export default class PciProjectNewPaymentDefaultCtrl {
  /* @ngInject */
  constructor(coreURLBuilder) {
    this.sectionUrls = coreURLBuilder.buildURLs({
      payment: { application: 'dedicated', path: '#/billing/payment/method' },
      myAccount: { application: 'dedicated', path: '#/useraccount/dashboard' },
    });
  }

  getFormatCreditCardNumber() {
    const { label, paymentType } = this.defaultPaymentMethod;
    const creditBankList = [
      PAYMENTS_TYPES.BANK_ACCOUNT,
      PAYMENTS_TYPES.CREDIT_CARD,
    ];

    if (creditBankList.includes(paymentType)) {
      return `····${label.substring(label.length - 4, label.length)}`;
    }

    return label;
  }

  getFormatExpirationDate() {
    return moment(this.defaultPaymentMethod.expirationDate).format('MM/YYYY');
  }
}
