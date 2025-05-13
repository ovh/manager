import find from 'lodash/find';
import map from 'lodash/map';

import { VALID_PAYMENTMEAN } from './quota.constants';

export default class {
  /* @ngInject */
  constructor(OvhApiMe) {
    this.OvhApiMe = OvhApiMe;
    this.serviceOptions = [];
  }

  /**
   * WARNING: should not be used anymore!!!
   * Need to use ovhPaymentMethod.getDefaultPaymentMethod instead.
   *
   * @deprecated since version 3.11.1
   */
  getDefaultPaymentMean(region) {
    if (region !== 'US') {
      return this.OvhApiMe.PaymentMean()
        .v6()
        .getDefaultPaymentMean();
    }

    return this.OvhApiMe.PaymentMethod()
      .v6()
      .query({
        status: VALID_PAYMENTMEAN,
      })
      .$promise.then((paymentMethodIds) =>
        map(paymentMethodIds, (paymentMethodId) =>
          Promise.all(
            this.OvhApiMe.PaymentMethod()
              .v6()
              .get({
                id: paymentMethodId,
              }).$promise,
          ),
        ),
      )
      .then((paymentMethods) =>
        find(paymentMethods, {
          default: true,
        }),
      );
  }

  getServiceOptions() {
    return this.serviceOptions;
  }

  setServiceOptions(serviceOptions = []) {
    this.serviceOptions = serviceOptions;
  }
}
