import { buildURLs } from '@ovh-ux/ufrontend/url-builder';

export default class PciProjectNewPaymentDefaultCtrl {
  constructor() {
    this.sectionUrls = buildURLs({
      payment: { application: 'dedicated', path: '#/billing/payment/method' },
      myAccount: { application: 'dedicated', path: '#/useraccount/dashboard' },
    });
  }
}
