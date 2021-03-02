export default class PciProjectNewPaymentDefaultCtrl {
  /* @ngInject */
  constructor(coreURLBuilder) {
    this.sectionUrls = coreURLBuilder.buildURLs({
      payment: { application: 'dedicated', path: '#/billing/payment/method' },
      myAccount: { application: 'dedicated', path: '#/useraccount/dashboard' },
    });
  }
}
