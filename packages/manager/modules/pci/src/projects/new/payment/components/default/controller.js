import get from 'lodash/get';

import { PCI_REDIRECT_URLS } from '../../../../../constants';

export default class PciProjectNewPaymentDefaultCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.sectionUrls = {
      payment: get(
        PCI_REDIRECT_URLS,
        `${coreConfig.getRegion()}.paymentMethods`,
      ),
      myAccount: get(PCI_REDIRECT_URLS, `${coreConfig.getRegion()}.myAccount`),
    };
  }
}
