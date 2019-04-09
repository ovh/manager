import get from 'lodash/get';
import EnvironmentService from '@ovh-ux/manager-config';

import { PCI_REDIRECT_URLS } from '../../../../constants';

export default class PciProjectsNewPaymentDefaultCtrl {
  /* @ngInject */
  constructor() {
    // dependencies injections

    // other attributes used in view
    this.paymentMethodUrl = get(
      PCI_REDIRECT_URLS,
      `${EnvironmentService.Environment.region}.paymentMethods`,
    );
  }
}
